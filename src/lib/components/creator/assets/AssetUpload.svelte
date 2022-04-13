<script lang="ts">
	import { uploadAsset } from '$lib/state/creator/assets';

	export let departmentId: string;
	export let folder: string;

	let files: FileList;
	let uploadFolder: string;
	let uploading = false;
	let fileInput: HTMLInputElement;
	async function onUpload() {
		if (!files || files.length !== 1) {
			return;
		}
		uploading = true;
		try {
			const file = files[0];
			if (!uploadFolder) {
				uploadFolder = folder;
			}
			await uploadAsset(departmentId, folder, file.name, file);
			uploadFolder = '';
			fileInput.value = '';
		} finally {
			uploading = false;
		}
	}
</script>

<form on:submit|preventDefault on:submit={onUpload}>
	<div class="row">
		<div class="col-md">
			<div class="input-group">
				<input
					class="form-control"
					type="text"
					bind:value={uploadFolder}
					placeholder={`Folder (defaults to ${folder || 'current'})`}
				/>
			</div>
		</div>
		<div class="col-md">
			<input bind:this={fileInput} class="form-control" type="file" multiple={false} bind:files />
		</div>
		<div class="col-auto">
			<input
				class="form-control btn btn-primary"
				type="submit"
				value="Upload"
				disabled={uploading}
			/>
		</div>
	</div>
</form>
