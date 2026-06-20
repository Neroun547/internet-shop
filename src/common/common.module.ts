import { Module } from "@nestjs/common";
import {CommonService} from "./common.service";
import { RubricsTypesModuleDb } from "../db/rubrics-types/rubrics-types.module";

@Module({
    imports: [RubricsTypesModuleDb],
    providers: [CommonService],
    exports: [CommonService]
})
export class CommonModule {}
