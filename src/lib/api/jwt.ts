import jsonwebtoken from 'jsonwebtoken';
import type { JwtPayload } from 'jsonwebtoken';

export type IJwtString<T = any> = { _type: T } & string;
export type IJwtPayload<T extends object = object> = JwtPayload & T;

export function decode<T extends object = object>(
	token: IJwtString<T>
): Promise<IJwtPayload<T> | undefined> {
	return new Promise((resolve) =>
		jsonwebtoken.verify(token, process.env.JWT_SECRET_KEY, (error, payload) => {
			if (error || !payload) {
				resolve(undefined);
			} else {
				resolve(payload as IJwtPayload<T>);
			}
		})
	);
}

export function encode<T extends object = object>(payload: T): Promise<IJwtString<T>> {
	return new Promise((resolve, reject) =>
		jsonwebtoken.sign(
			payload,
			process.env.JWT_SECRET_KEY,
			{
				algorithm: 'HS256'
			},
			(error, token) => {
				if (error || !token) {
					reject(error || new Error('Failed to sign token'));
				} else {
					resolve(token as IJwtString<T>);
				}
			}
		)
	);
}
