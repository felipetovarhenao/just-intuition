import ReactGA from "react-ga4";
import { UaEventOptions } from "react-ga4/types/ga4";

export enum EventAction {
  CLICK = "click",
}
export enum EventCategory {
  UI = "UI",
}
export enum EventName {
  START_QUIZ = "start_quiz",
  ANSWER_QUESTION = "answer_question",
  FINISH_QUIZ = "finish_quiz",
}
const useAnalyticsEventTracker = () => {
  const eventTracker = (name: EventName, options?: UaEventOptions) => {
    ReactGA.event(name, {
      action: EventAction.CLICK,
      category: EventCategory.UI,
      ...options,
    });
  };
  return eventTracker;
};
export default useAnalyticsEventTracker;
