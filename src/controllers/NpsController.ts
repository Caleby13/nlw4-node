import { Request, Response } from "express";
import { getCustomRepository, Not, IsNull } from "typeorm";
import { SurveyUserRepository } from "../repositories/SurveysUsersRepositories";

class NpsController {
  async execute(request: Request, response: Response) {
    const { survey_id } = request.params;

    const surveyUserRepository = getCustomRepository(SurveyUserRepository);

    const surveyUser = await surveyUserRepository.find({
      survey_id,
      value: Not(IsNull()),
    });

    function numberToFixed(value: number) {
      const newValue = value.toFixed(2);
      return Number(newValue);
    }

    const detractors = surveyUser.filter(
      (survey) => survey.value >= 0 && survey.value <= 6
    ).length;

    const passives = surveyUser.filter(
      (survey) => survey.value >= 7 && survey.value <= 8
    ).length;
    const promoters = surveyUser.filter(
      (survey) => survey.value >= 9 && survey.value <= 10
    ).length;
    const totalAnswers = surveyUser.filter(
      (survey) => survey.value >= 0 && survey.value <= 10
    ).length;

    const npsCalculate = ((promoters - detractors) / totalAnswers) * 100;

    const nps = numberToFixed(npsCalculate) || 0;

    return response.json({
      detractors,
      passives,
      promoters,
      totalAnswers,
      nps,
    });
  }
}
export { NpsController };
