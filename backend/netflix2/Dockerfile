# 1️⃣ 빌드 단계
FROM amazoncorretto:22 AS build

# 필수 패키지 설치 (bash, git, unzip, findutils → xargs 포함)
RUN yum install -y bash git unzip findutils && yum clean all

WORKDIR /app
COPY . /app
RUN chmod +x gradlew

# Gradle 빌드 (테스트 제외)
RUN ./gradlew clean bootJar -x test --stacktrace --no-daemon
