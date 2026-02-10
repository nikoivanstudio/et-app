import { exportUtils } from './export-utils';

describe('export-utils', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    jest.restoreAllMocks();
  });

  it('создает ссылку, кликает и очищает память', () => {
    const url = 'blob:test';
    if (!window.URL.createObjectURL) {
      window.URL.createObjectURL = jest.fn();
    }
    if (!window.URL.revokeObjectURL) {
      window.URL.revokeObjectURL = jest.fn();
    }

    const createUrl = jest
      .spyOn(window.URL, 'createObjectURL')
      .mockReturnValue(url);
    const revokeUrl = jest.spyOn(window.URL, 'revokeObjectURL');
    const clickSpy = jest.spyOn(HTMLAnchorElement.prototype, 'click');

    exportUtils.downLoadExportFile(new Blob(['data']));

    expect(createUrl).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();
    expect(revokeUrl).toHaveBeenCalledWith(url);
    expect(document.querySelector('a')).toBeNull();
  });
});
