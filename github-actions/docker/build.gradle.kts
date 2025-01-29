plugins {
	java
	id("org.springframework.boot") version "3.4.2"
	id("io.spring.dependency-management") version "1.1.7"
	id("org.flywaydb.flyway") version "10.20.0"
    id("com.epages.restdocs-api-spec") version "0.19.4"
    id("com.diffplug.spotless") version "6.25.0"
    id("org.asciidoctor.jvm.convert") version "4.0.4"
}

group = "com.moseoh"
version = "0.0.1-SNAPSHOT"

java {
	toolchain {
		languageVersion = JavaLanguageVersion.of(17)
	}
}

repositories {
	mavenCentral()
}

dependencies {
    // spring
	implementation("org.springframework.boot:spring-boot-starter-validation")
    implementation("org.springframework.boot:spring-boot-starter-webflux")
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.springframework.boot:spring-boot-starter-security")

	// s3
	implementation(platform("software.amazon.awssdk:bom:2.29.40")) 
    implementation("software.amazon.awssdk:s3")
    implementation("software.amazon.awssdk:cloudfront")
    implementation("software.amazon.awssdk:sso") 
    implementation("software.amazon.awssdk:ssooidc") 
    implementation("software.amazon.awssdk:auth") 
	
	// xss
    implementation("org.jsoup:jsoup:1.18.3")

    // security
    implementation("io.jsonwebtoken:jjwt-api:0.12.6")
    implementation("io.jsonwebtoken:jjwt-impl:0.12.6")
    implementation("io.jsonwebtoken:jjwt-jackson:0.12.6")

	// db
    runtimeOnly("org.postgresql:postgresql")

	// flyway
    implementation("org.flywaydb:flyway-core")
    runtimeOnly("org.flywaydb:flyway-mysql")

	// lombok
    compileOnly("org.projectlombok:lombok")
    annotationProcessor("org.projectlombok:lombok")

	// querydsl
    implementation("com.querydsl:querydsl-jpa:5.0.0:jakarta")
    annotationProcessor("com.querydsl:querydsl-apt:5.0.0:jakarta")
    annotationProcessor("jakarta.annotation:jakarta.annotation-api")
    annotationProcessor("jakarta.persistence:jakarta.persistence-api")

	// test
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("org.junit.jupiter:junit-jupiter-api")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")

    testImplementation("org.springframework.restdocs:spring-restdocs-mockmvc")
    testImplementation("com.epages:restdocs-api-spec-mockmvc:0.19.2")

    testImplementation("org.springframework.boot:spring-boot-testcontainers")
    testImplementation("org.testcontainers:junit-jupiter")
    testImplementation("org.testcontainers:mariadb")
    testImplementation("org.testcontainers:jdbc")
    testImplementation("org.springframework.security:spring-security-test")
    testImplementation("org.reflections:reflections:0.10.2")
}

tasks.withType<Test> {
	useJUnitPlatform()
}
