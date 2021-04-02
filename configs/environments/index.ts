import devConfigs from "./dev";
import prodConfigs from "./prod";

const EnvConfigs =
  process.env.NODE_ENV === "production" ? prodConfigs : devConfigs;

export default EnvConfigs;
