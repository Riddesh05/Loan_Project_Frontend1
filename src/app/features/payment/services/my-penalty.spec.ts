import { TestBed } from '@angular/core/testing';
import { MyPenalty } from './my-penalty';

describe('MyPenalty', () => {
  let service: MyPenalty;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyPenalty);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
