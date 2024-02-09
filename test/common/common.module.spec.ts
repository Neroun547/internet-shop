import { CommonModule } from "../../common/common.module";

describe("CommonModule", () => {
  let commonModule: CommonModule;

  beforeEach(() => {
    commonModule = new CommonModule();
  });

  it("CommonModule should be defined ", function() {
    expect(commonModule).toBeDefined();
  });

});
