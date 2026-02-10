import { isEstimation } from './typeguards';

describe('isEstimation', () => {
  it('возвращает true для валидной оценки', () => {
    expect(
      isEstimation({
        guideWork: 5,
        informationQuality: 4,
        trailQuality: 3
      })
    ).toBe(true);
  });

  it('возвращает false для объекта с неверными полями', () => {
    expect(isEstimation({ guideWork: '5' })).toBe(false);
  });
});
