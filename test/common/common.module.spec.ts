import { CommonService } from "../../common/common.service";
import { CommonModule } from "../../common/common.module";

describe("CommonModule", () => {
  let commonService: CommonService;
  let commonModule: CommonModule;

  beforeEach(() => {
    commonService = new CommonService();
    commonModule = new CommonModule();
  });

  it("CommonModule should be defined ", function() {
    expect(commonModule).toBeDefined();
  });

  it("CommonService should be defined", async () => {
    expect(commonService).toBeDefined();
  });
});
