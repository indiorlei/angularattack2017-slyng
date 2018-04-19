import { SlyngPage } from './app.po';

describe('slyng App', () => {
  let page: SlyngPage;

  beforeEach(() => {
    page = new SlyngPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
