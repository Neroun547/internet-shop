import { Loaded } from "@mikro-orm/core";
import { SettingsInterface } from "./interfaces/settings.interface";
import { Settings } from "./settings.entity";

export class SettingsMapper {
    static toDomain(entity: Loaded<Settings>): SettingsInterface {
        return {
            id: entity.id,
            setting_key: entity.setting_key,
            setting_value: entity.setting_value
        }
    }

    static toPersist(params: SettingsInterface): Settings {
        const newModel = new Settings();

        for(let key in params) {
            newModel[key] = params[key];
        }
        return newModel;
    }
}

