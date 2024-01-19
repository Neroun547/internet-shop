import { CommonService } from "../../common/common.service";
import { CommonModule } from "../../common/common.module";
import { translateTypeProduct } from "../../constants";

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

  it("Should return product type", function() {
    for(let key in translateTypeProduct) {
      expect(commonService.getTypeProductByValue(translateTypeProduct[key])).toMatchObject({ value: translateTypeProduct[key], key: key });
    }
  });
});
