import { async, TestBed } from '@angular/core/testing';

import { ExactCurrencyPipe } from './exact-currency.pipe';

describe('ExactCurrencyPipe', () => {
  let pipe: ExactCurrencyPipe;

  beforeEach(async(() => {
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    pipe = new ExactCurrencyPipe();
  });

  it('is instantiated', () => {
    expect(pipe).toBeTruthy();
  });

  it('shows no decimal with whole numbers of pounds', () => {
    expect(pipe.transform(12345)).toEqual('£12,345');
  });

  it('pads correctly with £*.50', () => {
    expect(pipe.transform(1234.5)).toEqual('£1,234.50');
  });

  it('works with values not requiring padding', () => {
    expect(pipe.transform(123.45)).toEqual('£123.45');
  });

  it('rounds unexpected > 2 d.p. values to 2 d.p.', () => {
    expect(pipe.transform(12.345)).toEqual('£12.35');
  });
});