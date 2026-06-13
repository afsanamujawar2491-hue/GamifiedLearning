package com.rurallearn.dto;

import com.rurallearn.entity.User;

public class UserDto {
    private Long id;
    private String name;
    private String email;
    private String role;
    private Integer grade;
    private Integer points;
    private Integer level;

    public static UserDto from(User user) {
        UserDto dto = new UserDto();
        dto.id = user.getId();
        dto.name = user.getName();
        dto.email = user.getEmail();
        dto.role = user.getRole().name();
        dto.grade = user.getGrade();
        dto.points = user.getPoints();
        dto.level = user.getLevel();
        return dto;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getRole() { return role; }
    public Integer getGrade() { return grade; }
    public Integer getPoints() { return points; }
    public Integer getLevel() { return level; }
}
