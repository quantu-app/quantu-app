<script>
	import { base } from '$app/paths';
</script>

<footer class="px-4 py-2 bg-dark">
	<div class="container py-4">
		<div class="row">
			<div class="col-md-6">
				<a class="btn btn-ghost text-white logo" href="/">
					<span class="btn btn-light q"
						><img
							src="https://raw.githubusercontent.com/quantu-app/design-platform/master/branding/logo/1x/logo-matrix-symmetric.png"
							alt="[Q]"
						/></span
					>
					<span class="rest">UANTU</span>
				</a>
			</div>
			<div class="col-md-6">
				<div class="row">
					<div class="col-6 text-white">
						<h4 class="fw-bold">Product</h4>
						<ul>
							<li><a class="link-light" href={`${base}/info/about-us`}>About us</a></li>
							<li><a class="link-light" href={`${base}/info/principles`}>Principles</a></li>
							<!--<li><a class="link-light" href={`${base}/community`}>Community</a></li>-->
							<li>
								<a
									class="link-light"
									href="https://trello.com/b/DrtlVKXH/product-roadmap"
									target="_blank">Roadmap</a
								>
							</li>
						</ul>
					</div>
					<div class="col-6 text-white">
						<h4 class="fw-bold">Developers</h4>
						<ul>
							<li>
								<a class="link-light" href="https://github.com/quantu-app">Open Source Projects</a>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
		<div class="row justify-content-end mt-4">
			<div class="col-md-4 col-sm-12 text-end">
				<a
					role="button"
					class="btn btn-light social"
					target="_blank"
					href="https://github.com/quantu-app"
				>
					<i class="bi bi-github" />
				</a>
				<a
					role="button"
					class="btn btn-light social"
					target="_blank"
					href="https://www.instagram.com/quantu.app/"
				>
					<i class="bi bi-instagram" />
				</a>
				<a
					role="button"
					class="btn btn-light social"
					target="_blank"
					href="https://twitter.com/QuantuApp"
				>
					<i class="bi bi-twitter" />
				</a>
			</div>
		</div>
	</div>
</footer>

<style lang="scss">
	.logo .q {
		line-height: 21px;
		border-radius: 100%;
		padding: 9px;
	}
	.logo .rest {
		font-family: 'Urbanist', sans-serif;
		vertical-align: sub;
	}
	.logo img {
		width: 21px;
		height: 21px;
	}

	ul {
		list-style: none;
		padding-left: 0;
	}

	.social {
		font-size: 1.5rem;
		padding: 0rem 0.3rem;
	}
</style>
