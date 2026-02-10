import { left, mapLeft, mapRight, matchEither, right } from './either';

describe('either', () => {
  it('создает left и right', () => {
    expect(left('err')).toEqual({ type: 'left', error: 'err' });
    expect(right(10)).toEqual({ type: 'right', value: 10 });
  });

  it('mapRight преобразует right и игнорирует left', () => {
    const resultRight = mapRight(right(2), value => value * 2);
    const resultLeft = mapRight(left('err'), value => value * 2);

    expect(resultRight).toEqual({ type: 'right', value: 4 });
    expect(resultLeft).toEqual({ type: 'left', error: 'err' });
  });

  it('mapLeft преобразует left и игнорирует right', () => {
    const resultLeft = mapLeft(left('err'), value => value.toUpperCase());
    const resultRight = mapLeft(right(2), value => value.toUpperCase());

    expect(resultLeft).toEqual({ type: 'left', error: 'ERR' });
    expect(resultRight).toEqual({ type: 'right', value: 2 });
  });

  it('matchEither вызывает правильный обработчик', () => {
    const leftResult = matchEither(left('e'), {
      left: value => `left:${value}`,
      right: value => `right:${value}`
    });
    const rightResult = matchEither(right(1), {
      left: value => `left:${value}`,
      right: value => `right:${value}`
    });

    expect(leftResult).toBe('left:e');
    expect(rightResult).toBe('right:1');
  });
});
