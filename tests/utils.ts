export const runningScreenshotTests = () =>
  process.env.__STENCIL_SCREENSHOT__ === "true";

export const dummyTest = () => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  it("dummy test", async () => {});
};
