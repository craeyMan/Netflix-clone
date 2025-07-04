package com.netflix2.netflix2.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
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
    private LocalDateTime createdAt;

    @Column(name = "is_secret")
    @JsonProperty("isSecret") 
    private boolean isSecret;
    
    @Builder.Default
    @Column(nullable = false)
    private int views = 0; 
}
