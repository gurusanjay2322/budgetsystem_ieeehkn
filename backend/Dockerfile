FROM maven:3.9.4-eclipse-temurin-21 AS build
WORKDIR /app

# 1️⃣ Copy pom.xml first
COPY pom.xml .

# 2️⃣ Download dependencies
# 2️⃣ Download dependencies
RUN mvn dependency:resolve

# 3️⃣ Copy the project source
COPY src ./src

# 4️⃣ Build
RUN mvn package -DskipTests


FROM eclipse-temurin:21-jdk
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
CMD ["java", "-jar", "app.jar"]
EXPOSE 8080
