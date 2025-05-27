CREATE TABLE `answer`
(
    `id` CHAR(36) NOT NULL,
    `gameId` CHAR(36) NOT NULL,
    `contestantId` CHAR(36) NOT NULL,
    `clueId` CHAR(36) NOT NULL,
    `answerText` TEXT NOT NULL,
    `correct` TINYINT(1) NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
);

CREATE TABLE `clue`
(
    `id` CHAR(36) NOT NULL,
    `answer` TEXT NOT NULL,
    `clueText` TEXT NOT NULL,
    `value` VARCHAR(4) NOT NULL,
    `category` TEXT NOT NULL,
    `showNumber` VARCHAR(5) NOT NULL,
    `airdate` CHAR(10) NOT NULL,
    `jArchiveGameId` VARCHAR(5) NOT NULL,
    `reported` TINYINT(1) NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
);

CREATE TABLE `contestant`
(
    `id` CHAR(36) NOT NULL,
    `gameId` CHAR(36) NOT NULL,
    `name` VARCHAR(200) NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
);

CREATE TABLE `game`
(
    `id` CHAR(36) NOT NULL,
    `speed` VARCHAR(6) NOT NULL DEFAULT 0,
    `infinite` TINYINT(1) NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
);

CREATE TABLE `statistic`
(
    `id` CHAR(36) NOT NULL,
    `gameId` CHAR(36) NOT NULL,
    `contestantId` CHAR(36) NOT NULL,
    `score` INT NOT NULL DEFAULT 0,
    `totalAnswers` INT NOT NULL DEFAULT 0,
    `correctAnswers` INT NOT NULL DEFAULT 0,
    `incorrectAnswers` INT NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
);