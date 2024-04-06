<script>
import { toggleMode } from "mode-watcher";
	import Separator from "./ui/separator/separator.svelte";
</script>

<div class="flex items-center justify-between space-x-2 w-full p-4">
	<p class="text-xs font-normal leading-snug text-muted-foreground flex">
		&copy; 2024 All rights reserved
	</p>
	<div class="flex h-4 gap-2">
		<button on:click={toggleMode} class="text-muted-foreground"><span class="hidden dark:flex">light</span><span class="flex dark:hidden">dark</span></button>
		<Separator orientation="vertical" />
		<a
			href="https://github.com/vabe"
			target="_blank"
			class="text-xs font-normal leading-snug text-muted-foreground">@vabe</a
		>
	</div>
</div>
