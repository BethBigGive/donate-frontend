import {environment} from "../environments/environment";
import {EnvironmentID} from "../environments/environment.interface";

export const flagsForEnvironment = (environmentId: EnvironmentID) => {
  return {
    // no feature flags of this sort currently in use.
  };
}

export const flags = flagsForEnvironment(environment.environmentId);
