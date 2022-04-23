<svelte:options immutable />

<script context="module" lang="ts">
	// see: https://ogp.me/#no_vertical
	export type ObjectTypeValue = 'article' | 'book' | 'profile' | 'website';
	export type Gender = 'male' | 'female';

	export type ProfileObject = {
		firstname: string;
		lastname: string;
		username: string;
		gender: Gender;
	};

	export type ArticleObject = {
		publishedTime: Date;
		modifiedTime?: Date;
		expirationTime?: Date;
		section?: string;
		authors: ProfileObject[];
		tags: string[];
	};
</script>

<script lang="ts">
	import { format } from 'date-fns';
	// see: https://developers.facebook.com/docs/sharing/webmasters
	export let url: string = undefined;
	export let title: string = undefined;
	export let description: string = undefined;
	export let language: string = undefined;
	export let type: ObjectTypeValue = undefined;
	export let article: ArticleObject = undefined;
	export let profile: ProfileObject = undefined;
</script>

<meta property="og:site_name" content="QUANTU" />
<meta property="og:locale" content={language ? language : 'en'} />
{#if url}
	<meta property="og:url" content={url} />
{/if}
{#if title}
	<meta property="og:title" content={title} />
{/if}
{#if description}
	<meta property="og:url" content={description} />
{/if}
{#if type}
	<meta property="og:type" content={type} />
	{#if type == 'article'}
		<meta
			property="article:published_time"
			content={format(new Date(article.publishedTime), "yyyy-MM-dd'T'HH:mm:ss'Z'")}
		/>
		{#if article.modifiedTime}
			<meta
				property="article:modified_time"
				content={format(new Date(article.modifiedTime), "yyyy-MM-dd'T'HH:mm:ss'Z'")}
			/>
		{/if}
		{#if article.expirationTime}
			<meta
				property="article:expiration_time"
				content={format(article.expirationTime, "yyyy-MM-dd'T'HH:mm:ss'Z'")}
			/>
		{/if}
		{#if article.section}
			<meta property="article:section" content={article.section} />
		{/if}
		{#if article.authors && article.authors.length}
			{#each article.authors as author}
				<meta property="article:author" content={author.firstname + ' ' + author.lastname} />
			{/each}
		{/if}
		{#if article.tags && article.tags.length}
			{#each article.tags as tag}
				<meta property="article:tag" content={tag} />
			{/each}
		{/if}
	{:else if type == 'profile'}
		<meta property="profile:first_name" content={profile.firstname} />
		<meta property="profile:last_name" content={profile.lastname} />
		<meta property="profile:username" content={profile.username} />
	{/if}
{/if}
