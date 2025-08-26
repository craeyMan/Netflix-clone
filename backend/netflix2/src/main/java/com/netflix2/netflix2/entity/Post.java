package com.netflix2.netflix2.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.ZonedDateTime;
import java.time.ZoneId;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String content;
    private String author;
    private ZonedDateTime createdAt;

    @Column(name = "is_secret")
    @JsonProperty("isSecret") 
    private boolean isSecret;
    
    @Builder.Default
    @Column(nullable = false)
    private int views = 0; 
    
    @PrePersist
    public void prePersist() {
    this.createdAt = ZonedDateTime.now(ZoneId.of("Asia/Seoul"));
    }
}
