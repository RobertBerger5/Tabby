CREATE TABLE IF NOT EXISTS users (
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	username VARCHAR(25) NOT NULL UNIQUE,
	password VARCHAR(255) NOT NULL
) ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS tabs (
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	title VARCHAR(255) DEFAULT '(untitled)' NOT NULL,
	user INT NOT NULL, /*user id of tab owner*/
	forked_from INT NOT NULL, /*tab id of where it was forked from*/
	is_public BOOLEAN NOT NULL,
	last_edit TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	/*there is a JSON type in MySQL, but we should never have to interact with it other than updating the entire .json file*/
	tab_data MEDIUMTEXT NOT NULL,
	/*commented out because why not let users have multiple tabs with the same name? Maybe ask them if they're sure they want to save under the same name as an existing tab first*/
	/*CONSTRAINT no_same_titles UNIQUE (title,user),*/
	FOREIGN KEY (user) REFERENCES users(id),
	FOREIGN KEY (forked_from) REFERENCES tabs(id)
) ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS tags (
	tab INT NOT NULL,
	tag VARCHAR(15), /*shouldn't have tags longer than 15 chars*/
	CONSTRAINT no_duplicate_tag UNIQUE (tab,tag),
	FOREIGN KEY (tab) REFERENCES tabs(id)
) ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS likes (
	tab INT NOT NULL,
	user INT NOT NULL,
	CONSTRAINT one_like_per_user UNIQUE (tab,user),
	FOREIGN KEY (tab) REFERENCES tabs(id),
	FOREIGN KEY (user) REFERENCES users(id)
) ENGINE=INNODB;

/*one tab being shared with a user*/
CREATE TABLE IF NOT EXISTS shares (
	tab INT NOT NULL,
	user INT NOT NULL,
	can_edit BOOLEAN NOT NULL,
	CONSTRAINT no_multiple_share UNIQUE (tab, user),
	FOREIGN KEY (tab) REFERENCES tabs(id),
	FOREIGN KEY (user) REFERENCES users(id)
) ENGINE=INNODB;

/*TODO: run my password through the same encryption as the final product will use, and insert that straight into here*/
INSERT INTO users VALUES (1,'rob','$2y$10$9GPRV3MbXTyVOGFDDEQt0eo/4l7WIXgGBVPv1ztbrfs49DDi4YF7i');

INSERT INTO tabs VALUES (1,'(blank)',1,1,TRUE,CURRENT_TIMESTAMP,'{\"info\":{\"title\":\"(title)\"},\"tracks\":[{\"name\":\"guitar\",\"voice\":\"guitar_distort\",\"strings\":[{\"note\":\"E\",\"octave\":4},{\"note\":\"B\",\"octave\":3},{\"note\":\"G\",\"octave\":3},{\"note\":\"D\",\"octave\":3},{\"note\":\"A\",\"octave\":2},{\"note\":\"E\",\"octave\":2}]},{\"name\":\"bass\",\"voice\":\"bass_picked\",\"strings\":[{\"note\":\"G\",\"octave\":2},{\"note\":\"D\",\"octave\":2},{\"note\":\"A\",\"octave\":1},{\"note\":\"E\",\"octave\":1}]}],\"measures\":[{\"timeN\":4,\"timeD\":4,\"tempo\":120,\"tracks\":[[{\"duration\":1,\"notes\":[]}],[{\"duration\":1,\"notes\":[]}]]}]}');
/*Note: this tab says it's forked from itself because "forked from" can't be null. Might have to allow null just for this, I still want everyone to fork from one original tab*/

INSERT INTO tags VALUES (1,'welcometotabby');
INSERT INTO tags VALUES (1,'firsttab');
INSERT INTO likes VALUES(1,1); /*I like my own tab*/
