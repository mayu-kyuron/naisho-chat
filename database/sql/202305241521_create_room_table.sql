USE naisho_chat;

CREATE TABLE IF NOT EXISTS room (
  `id` int(11) UNSIGNED NOT NULL,
  `name` varchar(256) NOT NULL,
  `created_by` int(11) UNSIGNED NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_general_ci;

ALTER TABLE room
  ADD PRIMARY KEY (`id`);

ALTER TABLE room
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;
