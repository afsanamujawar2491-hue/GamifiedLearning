package com.rurallearn.dto;

import java.util.List;

public class CreateQuizRequest {

    private String title;
    private String subject;
    private String difficulty;
    private Integer pointsReward;
    private Integer timeLimit;
    private List<QuestionInput> questions;

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }
    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }
    public Integer getPointsReward() { return pointsReward; }
    public void setPointsReward(Integer pointsReward) { this.pointsReward = pointsReward; }
    public Integer getTimeLimit() { return timeLimit; }
    public void setTimeLimit(Integer timeLimit) { this.timeLimit = timeLimit; }
    public List<QuestionInput> getQuestions() { return questions; }
    public void setQuestions(List<QuestionInput> questions) { this.questions = questions; }
}
