<?php
require_once('settings.php');
class DB_HANDLER {

	private int $rows = 0;
	private $pdo;

	public function connect(): void
    {
        $host = get_string_setting('mysql_host');
        $user = get_string_setting('mysql_user');
        $pass = get_string_setting('mysql_password');
        $database = get_string_setting('mysql_database');
		$conn = "mysql:host={$host};dbname={$database};charset=utf8";
		$options = [
			PDO::ATTR_EMULATE_PREPARES			=> false,
			PDO::ATTR_ERRMODE					=> PDO::ERRMODE_EXCEPTION,
			PDO::ATTR_DEFAULT_FETCH_MODE		=> PDO::FETCH_ASSOC,
		];
		try {
			$this->pdo = new PDO($conn, "{$user}", "{$pass}", $options);
		} catch(Exception $e) {
			error_log($e->getMessage());
		}
	}


	public function query($sql, $args = null, $return = true): ?array
    {
	    try {
            $stmt = $this->pdo->prepare($sql);
        } catch(Exception $e){
	        error_log("MYSQL Error: " . $e->getMessage());
	        return null;
        }
		if($args)
			$stmt->execute($args);
		else
			$stmt->execute();
		$this->rows = $stmt->rowCount();

		$result = null;
		if($return)
			$result = $stmt->fetchAll();
		$stmt = null;

		return $result;
	}

	public function prepare($sql){
		return $this->pdo->prepare($sql);
	}

	public function beginTransaction(){
		$this->pdo->beginTransaction();
	}

	public function commit(){
		$this->pdo->commit();
	}

	public function rollback(){
		$this->pdo->rollback();
	}

	public function get_rows(){
		return $this->rows;
	}

	public function close(){
		$this->pdo = null;
	}

}
?>