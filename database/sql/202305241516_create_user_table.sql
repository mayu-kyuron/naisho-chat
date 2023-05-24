USE naisho_chat;

CREATE TABLE IF NOT EXISTS user (
  `id` int(11) UNSIGNED NOT NULL,
  `username` varchar(256) NOT NULL,
  `password` varchar(256) NOT NULL,
  `role` varchar(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_general_ci;

ALTER TABLE user
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

ALTER TABLE user
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;
