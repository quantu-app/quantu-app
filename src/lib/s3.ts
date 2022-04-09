import { dev } from '$app/env';
import {
	S3Client,
	ListObjectsCommand,
	PutObjectCommand,
	GetObjectCommand
} from '@aws-sdk/client-s3';
import { basename, dirname } from 'path';

const ENV = dev ? 'dev' : 'prod';

export interface IAsset {
	type: string;
	folder: string;
	name: string;
}

export const client = new S3Client({
	region: process.env.S3_REGION,
	endpoint: `https://${process.env.S3_REGION}.linodeobjects.com`,
	credentials: {
		accessKeyId: process.env.S3_ACCESS_KEY,
		secretAccessKey: process.env.S3_SECRET_KEY
	}
});

export async function listAssets(type: string, folder = '/'): Promise<IAsset[]> {
	const assets: IAsset[] = [];
	const basePath = `${ENV}/${type}/`;

	if (!folder.endsWith('/')) {
		folder += '/';
	}

	for await (const item of list(`${basePath}${folder}`)) {
		let path: string;
		let itemType = type;

		if (typeof item === 'string') {
			path = item.slice(basePath.length);
			itemType = 'folder';
		} else {
			path = item.Key.slice(basePath.length);
		}

		assets.push({
			type: itemType,
			folder: dirname(path),
			name: basename(path)
		});
	}

	return assets;
}

export async function uploadAsset(
	type: string,
	folder: string,
	name: string,
	body: ArrayBuffer
): Promise<IAsset> {
	await client.send(
		new PutObjectCommand({
			Key: `${ENV}/${type}/${folder ? `${folder}/` : ''}${name}`,
			Bucket: process.env.S3_BUCKET,
			ContentLength: body.byteLength,
			Body: Buffer.from(body)
		})
	);
	return { type, folder, name };
}

export async function getAsset(type: string, folder: string, name: string) {
	const result = await client.send(
		new GetObjectCommand({
			Key: `${ENV}/${type}/${folder ? `${folder}/` : ''}${name}`,
			Bucket: process.env.S3_BUCKET
		})
	);
	return result.Body;
}

async function* list(folder: string) {
	let result = await client.send(
		new ListObjectsCommand({
			Bucket: process.env.S3_BUCKET,
			Delimiter: '/',
			Prefix: folder
		})
	);

	if (result.CommonPrefixes) {
		for (const prefix of result.CommonPrefixes) {
			if (prefix.Prefix) {
				yield prefix.Prefix;
			}
		}
	}
	if (result.Contents) {
		for (const item of result.Contents) {
			yield item;
		}
	}

	while (result.IsTruncated) {
		result = await client.send(
			new ListObjectsCommand({
				Bucket: process.env.S3_BUCKET,
				Marker: result.NextMarker,
				Delimiter: '/',
				Prefix: folder
			})
		);

		if (result.CommonPrefixes) {
			for (const prefix of result.CommonPrefixes) {
				if (prefix.Prefix) {
					yield prefix.Prefix;
				}
			}
		}
		if (result.Contents) {
			for (const item of result.Contents) {
				yield item;
			}
		}
	}
}
