import Koa from "koa";
import { Server } from "http";
import Configs from "./configs/environments";
import { print } from "./utilities/utils";

module.exports = (async (): Promise<Server> => {
  try {
    const app: Koa = new Koa();
    return app.listen(Configs.port, () => {
      print.success(`Snapod server listening on port ${Configs.port} in ${Configs.mode} mode`);
    });
  } catch (e) {
    console.log(e);
  }
})();
