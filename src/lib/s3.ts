import {
	S3Client,
	ListObjectsCommand,
	PutObjectCommand,
	GetObjectCommand,
	type _Object,
	DeleteObjectCommand
} from '@aws-sdk/client-s3';

const ENV = process.env.NODE_ENV === 'production' ? 'prod' : 'dev';

export const s3Client = new S3Client({
	region: process.env.S3_REGION,
	endpoint: `https://${process.env.S3_REGION}.linodeobjects.com`,
	credentials: {
		accessKeyId: process.env.S3_ACCESS_KEY,
		secretAccessKey: process.env.S3_SECRET_KEY
	}
});

export async function s3Upload(folder: string, name: string, body: ArrayBuffer) {
	if (folder === '.') {
		folder = '';
	}
	if (folder.length && !folder.endsWith('/')) {
		folder += '/';
	}
	const buffer = Buffer.from(body);
	await s3Client.send(
		new PutObjectCommand({
			Key: `${ENV}/${folder}${name}`,
			Bucket: process.env.S3_BUCKET,
			ContentLength: buffer.byteLength,
			Body: buffer
		})
	);
}

export async function s3Get(folder: string, name: string) {
	if (folder === '.') {
		folder = '';
	}
	if (folder.length && !folder.endsWith('/')) {
		folder += '/';
	}
	return s3Client.send(
		new GetObjectCommand({
			Key: `${ENV}/${folder}${name}`,
			Bucket: process.env.S3_BUCKET
		})
	);
}

export async function s3Delete(folder: string, name: string) {
	if (folder === '.') {
		folder = '';
	}
	if (folder.length && !folder.endsWith('/')) {
		folder += '/';
	}
	await s3Client.send(
		new DeleteObjectCommand({
			Key: `${ENV}/${folder}${name}`,
			Bucket: process.env.S3_BUCKET
		})
	);
}

export async function* s3List(folder: string) {
	if (folder === '.') {
		folder = '';
	}
	if (folder.length && !folder.endsWith('/')) {
		folder += '/';
	}
	yield* s3ListRecur(folder);
}

async function* s3ListRecur(folder: string, marker?: string): AsyncGenerator<string | _Object> {
	const result = await s3Client.send(
		new ListObjectsCommand({
			Bucket: process.env.S3_BUCKET,
			Marker: marker,
			Delimiter: '/',
			Prefix: `${ENV}/${folder}`
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

	if (result.IsTruncated) {
		yield* s3ListRecur(folder, result.NextMarker);
	}
}
