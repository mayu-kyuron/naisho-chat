import { Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';

const RedisDataType = {
  string: 0,
  hash: 1,
  set: 2,
  list: 3,
} as const;
type RedisDataType = typeof RedisDataType[keyof typeof RedisDataType];

const RedisCommandType = {
  get: 0,
  set: 1,
  delete: 2,
} as const;
type RedisCommandType = typeof RedisCommandType[keyof typeof RedisCommandType];

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);
  private readonly redis = new Redis({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  });

  /**
   * Redisにキーと値を設定する。
   * ※すでに重複したキーが存在する場合は、上書きする。
   * @param key キー
   * @param value 値
   * @returns 成功なら true 、失敗なら false
   */
  async set(key: string, value: string | Buffer | number): Promise<boolean> {
    await this.redis.set(key, value);

    this.logger.debug(this.getLogMessage(RedisDataType.string, RedisCommandType.set)
      + ` -> ${key}: ${value}`);

    return true;
  }

  /**
   * Redisからキーに紐づく値を取得する。
   * ※キーが存在しない場合は、null を返す。
   * @param key キー
   * @returns 値
   */
  async get(key: string): Promise<string | null> {
    const value = await this.redis.get(key);

    this.logger.debug(this.getLogMessage(RedisDataType.string, RedisCommandType.get)
      + ` -> ${key}: ${value}`);

    return value;
  }

  /**
   * Redisからキーを削除する。
   * @param key キー
   * @returns 削除件数
   */
  async delete(key: string): Promise<number> {
    const numOfRows = await this.redis.del(key);

    this.logger.debug(this.getLogMessage(RedisDataType.string, RedisCommandType.delete)
      + ` -> affected rows by ${key}: ${numOfRows}`);

    return numOfRows;
  }

  /**
   * Redisにキーとハッシュを設定する。
   * ※すでに重複したキーが存在する場合は、ハッシュを追加する。
   * ※すでに重複したフィールドが存在する場合は、上書きする。
   * @param key キー
   * @param field フィールド
   * @param value 値
   * @returns 成功なら true 、失敗なら false
   */
  async setHash(key: string, field: string, value: (string | number | Buffer)): Promise<boolean> {
    await this.redis.hset(key, field, value);

    this.logger.debug(this.getLogMessage(RedisDataType.hash, RedisCommandType.set)
      + ` -> ${key}: { ${field}: ${value} }`);

    return true;
  }

  /**
   * Redisからキーに紐づくハッシュ内のフィールドの値を取得する。
   * @param key キー
   * @param field フィールド
   * @returns 値
   */
  async getHash(key: string, field: string): Promise<string> {
    const value = await this.redis.hget(key, field);

    this.logger.debug(this.getLogMessage(RedisDataType.hash, RedisCommandType.get)
      + ` -> ${key}: { ${field}: ${value} }`);

    return value;
  }

  /**
   * Redisのハッシュからフィールドを削除する。
   * @param key キー
   * @param fields フィールド
   * @returns 削除件数
   */
  async deleteFromHash(key: string, fields: string[]): Promise<number> {
    const numOfRows = await this.redis.hdel(key, ...fields);

    this.logger.debug(this.getLogMessage(RedisDataType.hash, RedisCommandType.delete)
      + ` -> affected rows by ${key}: { ${fields.toString()}: ${numOfRows} }`);

    return numOfRows;
  }

  /**
   * Redisにキーとメンバーを設定する。
   * ※すでに重複したキーが存在する場合は、メンバーを追加する。
   * ※すでに重複したメンバーが存在する場合は、何もしない。
   * @param key キー
   * @param values 値
   * @returns 成功なら true 、失敗なら false
   */
  async setMembers(key: string, values: (string | number | Buffer)[]): Promise<boolean> {
    await this.redis.sadd(key, ...values);

    this.logger.debug(this.getLogMessage(RedisDataType.set, RedisCommandType.set)
      + ` -> ${key}: ${values.toString()}`);

    return true;
  }

  /**
   * Redisからキーに紐づくメンバーを取得する。
   * @param key キー
   * @returns 値の配列
   */
  async getMembers(key: string): Promise<string[]> {
    const values = await this.redis.smembers(key);

    this.logger.debug(this.getLogMessage(RedisDataType.set, RedisCommandType.get)
      + ` -> ${key}: ${values.toString()}`);

    return values;
  }

  /**
   * Redisのメンバーから値を削除する。
   * @param key キー
   * @param values 値の配列
   * @returns 削除件数
   */
  async deleteFromMembers(key: string, values: (string | number | Buffer)[]): Promise<number> {
    const numOfRows = await this.redis.srem(key, ...values);

    this.logger.debug(this.getLogMessage(RedisDataType.set, RedisCommandType.delete)
      + ` -> affected rows by ${key}: ${numOfRows}`);

    return numOfRows;
  }

  /**
   * Redisにキーとリストを設定する。
   * ※すでに重複したキーが存在する場合は、値を追加する。
   * @param key キー
   * @param values 値の配列
   * @returns 成功なら true 、失敗なら false
   */
  async setList(key: string, values: (string | number | Buffer)[]): Promise<boolean> {
    await this.redis.rpush(key, ...values);

    this.logger.debug(this.getLogMessage(RedisDataType.list, RedisCommandType.set)
      + ` -> ${key}: ${values.toString()}`);

    return true;
  }

  /**
   * Redisからキーに紐づくリストを取得する。
   * @param key キー
   * @param start 開始位置
   * @param end 終了位置
   * @returns 値の配列
   */
  async getList(key: string, start = 0, end = -1): Promise<string[]> {
    const values = await this.redis.lrange(key, start, end);

    this.logger.debug(this.getLogMessage(RedisDataType.list, RedisCommandType.get)
      + ` -> ${key}: ${values.toString()}`);

    return values;
  }

  /**
   * Redisのリストから値を削除する。
   * @param key キー
   * @param value 値
   * @param count 0より大きければ先頭から、小さければ末尾からの削除件数。0の場合は全件。
   * @returns 削除件数
   */
  async deleteFromList(key: string, value: (string | number | Buffer), count = 1): Promise<number> {
    const numOfRows = await this.redis.lrem(key, count, value);

    this.logger.debug(this.getLogMessage(RedisDataType.list, RedisCommandType.delete)
      + ` -> affected rows by ${key}: ${numOfRows}`);

    return numOfRows;
  }

  /**
   * Redisから複数のキーに紐づく値をすべて取得する。
   * @param keys キーの配列
   * @returns 値の配列
   */
  async getByKeys(keys: string[]): Promise<string[]> {
    if (keys == null || keys.length == 0) {
      this.logger.debug(`Redis keys not set. -> keys: ${keys.toString()}`);
      return [];
    }

    const values = await this.redis.mget(keys);

    this.logger.debug(this.getLogMessage(RedisDataType.string, RedisCommandType.get)
      + ` -> ${keys.toString()}: ${values.toString()}`);

    return values;
  }

  /**
   * ログメッセージを取得する。
   * @param dataType Redisのデータ型
   * @param commandType Redisのコマンド種別
   * @returns ログメッセージ
   */
  private getLogMessage(dataType: RedisDataType, commandType: RedisCommandType): string {
    let message: string = 'Redis';

    switch (dataType) {
      case RedisDataType.hash:
        message += ' hash';
        break;
      case RedisDataType.set:
        message += ' member';
        break;
      case RedisDataType.list:
        message += ' list';
        break;
    }

    message += ' data';

    switch (commandType) {
      case RedisCommandType.get:
        message += ' selected';
        break;
      case RedisCommandType.set:
        message += ' inserted';
        break;
      case RedisCommandType.delete:
        message += ' deleted';
        break;
      default:
        message += ' done something';
    }

    message += '.';

    return message;
  }
}
