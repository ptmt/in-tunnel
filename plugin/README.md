# IntelliJ Tunnel Plugin

## Release build and Marketplace distribution

- Update `version` in `build.gradle.kts` and confirm the `sinceBuild`/`untilBuild` range.
- Build the release artifact with `./gradlew buildPlugin` (ZIP goes to `build/distributions`).
- Optional: run `./gradlew verifyPlugin` before signing/publishing.
- Configure signing and publishing credentials (example below) and keep secrets in env vars:

```kotlin
intellijPlatform {
    signing {
        certificateChain.set(providers.environmentVariable("CERTIFICATE_CHAIN"))
        privateKey.set(providers.environmentVariable("PRIVATE_KEY"))
        password.set(providers.environmentVariable("PRIVATE_KEY_PASSWORD"))
    }
    publishing {
        token.set(providers.environmentVariable("PUBLISH_TOKEN"))
    }
}
```

- Sign and publish with `./gradlew signPlugin` and `./gradlew publishPlugin`.
