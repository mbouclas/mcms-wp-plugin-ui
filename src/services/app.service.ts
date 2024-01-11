import {BaseHttpService} from "./base-http.service";

export class AppService extends BaseHttpService {
    async boot() {
        return await this.get('boot');
    }
}
