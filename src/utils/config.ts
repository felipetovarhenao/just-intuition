export enum DeploymentType {
  PROD,
  DEV,
}

const CONFIG = {
  origin: window.location.origin,
  deploymentType: (() => {
    const origin = window.location.origin;
    if (origin.includes("felipe-tovar-henao.com")) {
      return DeploymentType.PROD;
    } else {
      return DeploymentType.DEV;
    }
  })(),
};

export default CONFIG;
