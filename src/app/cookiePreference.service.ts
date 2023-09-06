import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {CookieService} from "ngx-cookie-service";
import {environment} from "../environments/environment";
import {map} from "rxjs/operators";

type CookiePreferences =
    {agreedToAll: true} |
    {
      agreedToAll: false,
      agreedToCookieTypes: {
        analyticsAndTesting: boolean,
        thirdParty: boolean,
      }};

@Injectable({
  providedIn: 'root',
})
export class CookiePreferenceService {

  private cookiePreferences$: Subject<CookiePreferences | undefined>;

  private optInToAnalyticsAndTesting$: Subject<null>;

  private readonly cookieName = "cookie-preferences";
  private readonly cookieExpiryPeriodDays = 365;

  constructor(
      private cookieService: CookieService,
  ) {
    let cookiePreferences;
    try {
      cookiePreferences = JSON.parse(this.cookieService.get(this.cookieName)) as CookiePreferences;
    } catch (e) {
      cookiePreferences = undefined;
    }

    this.cookiePreferences$ = new BehaviorSubject(cookiePreferences);
    if (cookiePreferences?.agreedToAll || cookiePreferences?.agreedToCookieTypes.analyticsAndTesting) {
        this.optInToAnalyticsAndTesting$ = new BehaviorSubject(null);
    } else {
      this.optInToAnalyticsAndTesting$ = new Subject<null>;
    }
  }
  userHasExpressedCookiePreference(): Observable<boolean>
  {
    return this.cookiePreferences$.pipe(map(value => !! value));
  }

  /**
   * Returns an observable that emits void iff and when the user has agreed to accept marketing cookies - either
   * on subscription if they agreed in the past and we saved a cookie, or later if they agree during this session.
   */
  userOptInToAnalyticsAndTesting(): Observable<null>
  {
    return this.optInToAnalyticsAndTesting$;
  }

  agreeToAll() {
    const preferences: CookiePreferences = {agreedToAll: true};
    this.cookieService.set(this.cookieName, JSON.stringify(preferences), this.cookieExpiryPeriodDays, '/', environment.sharedCookieDomain)
    this.cookiePreferences$.next(preferences);
    this.optInToAnalyticsAndTesting$.next(null);
  }

  storePreferences(preferences: CookiePreferences) {
    this.cookieService.set(this.cookieName, JSON.stringify(preferences), this.cookieExpiryPeriodDays, '/', environment.sharedCookieDomain)
    this.cookiePreferences$.next(preferences);

    if (preferences.agreedToAll || preferences.agreedToCookieTypes.analyticsAndTesting) {
      this.optInToAnalyticsAndTesting$.next(null);
    }
  }
}
