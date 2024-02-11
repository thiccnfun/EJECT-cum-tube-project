<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { user } from '$lib/stores/user';
	import { page } from '$app/stores';
	import { notifications } from '$lib/components/toasts/notifications';
	import SettingsCard from '$lib/components/SettingsCard.svelte';
	import IconDropletFilled from '~icons/tabler/droplet-filled';
	import AccessPoint from '~icons/tabler/access-point';
	import AccessPointOff from '~icons/tabler/access-point-off';
	import Propeller from '~icons/tabler/propeller';

	const DIVISOR = 800;

	type PumpState = {
		ejecting: boolean;
	};

	type PumpSettings = {
		cum_time: number;
		cum_size: number;
		cum_accel: number;
		reverse?: boolean;
		continuous?: boolean;
	};

	type Presets = {
		[key: string]: PumpSettings;
	};

	const presets: Presets = {
		'Big Squirt': {
			cum_time: 1,
			cum_size: 75 * DIVISOR,
			cum_accel: 200 * DIVISOR,
			continuous: false,
		},
		'Small Squirt': {
			cum_time: 0,
			cum_size: 30 * DIVISOR,
			cum_accel: 200 * DIVISOR,
			continuous: false,
		},
	};

	let pumpState: PumpState = { ejecting: false };
	let pumpSettings: PumpSettings = { 
		cum_time: 0, cum_size: 800, cum_accel: 800, reverse: false, continuous: false 
	};
	let cumSizeValue = pumpSettings.cum_size / DIVISOR;
	let cumAccelValue = pumpSettings.cum_accel / DIVISOR;
	let selectedPreset = '';
	let pumpConnected = false;

	const ws_token = $page.data.features.security ? '?access_token=' + $user.bearer_token : '';

	// pump state websocket
	const pumpStateSocket = new WebSocket('ws://' + $page.url.host + '/ws/pumpState' + ws_token);

	pumpStateSocket.onopen = (event) => {
		pumpStateSocket.send('Hello');
	};

	pumpStateSocket.addEventListener('close', (event) => {
		const closeCode = event.code;
		const closeReason = event.reason;
		console.log('Pump State WebSocket closed with code:', closeCode);
		console.log('Close reason:', closeReason);
		notifications.error('Websocket disconnected', 5000);
	});

	pumpStateSocket.onmessage = (event) => {
		const message = JSON.parse(event.data);
		if (message.type != 'id') {
			pumpState = message;
		}
	};

	// pump state websocket
	const pumpSettingsSocket = new WebSocket('ws://' + $page.url.host + '/ws/pumpSettings' + ws_token);

	pumpSettingsSocket.onopen = (event) => {
		pumpSettingsSocket.send('Hello');
		pumpConnected = true;
	};

	pumpSettingsSocket.addEventListener('close', (event) => {
		const closeCode = event.code;
		const closeReason = event.reason;
		console.log('Pump State WebSocket closed with code:', closeCode);
		console.log('Close reason:', closeReason);
		notifications.error('Websocket disconnected', 5000);
		pumpConnected = false;
	});

	pumpSettingsSocket.onmessage = (event) => {
		const message = JSON.parse(event.data);
		if (message.type != 'id') {
			pumpSettings = message;
			cumSizeValue = pumpSettings.cum_size / DIVISOR
			cumAccelValue = pumpSettings.cum_accel / DIVISOR
		}
	};

	onDestroy(() => {
		pumpStateSocket.close()
		pumpSettingsSocket.close()
	});

	onMount(() => {
		// 
	});

	async function toggleEject() {
		pumpStateSocket.send(JSON.stringify({ ejecting: !pumpState.ejecting }));
	}

	async function updateSettings (settings: any) {
		pumpSettingsSocket.send(JSON.stringify({ 
			...pumpSettings,
			...settings
		}));
	}

	async function updateSetting (key: string, value: number | boolean) {
		updateSettings({ [key]: value });
	}

</script>

<SettingsCard collapsible={false}>
	<span slot="icon" class="flex-shrink-0 mr-2 h-6 w-6 self-end">
		{#if pumpConnected}
			<AccessPoint />
		{:else}
			<AccessPointOff />
		{/if}
	</span>
	<span slot="title">Pump {pumpConnected ? 'Connected' : 'Disconnected'}</span>
	<div class="flex flex-row flex-grow {pumpConnected ? '' : 'area-disabled'}">
		<select 
			class="select select-bordered"
			bind:value={selectedPreset}
			on:change={(e) => {
				const preset = presets[e.target.value];
				if (!preset) return;
				const newSettings = { ...pumpSettings, ...preset};
				updateSettings(newSettings);
			}}
		>
			<option value="" disabled selected>Presets</option>
			{#each Object.keys(presets) as preset}
				<option value={preset}>{preset}</option>
			{/each}
		</select>
		<label class="label cursor-pointer ml-auto">
			<b class="mr-4">Reverse Flow</b>
			<input
				type="checkbox"
				class="toggle toggle-primary"
				bind:checked={pumpSettings.reverse}
				on:change={(e) => {
					updateSetting('reverse', e.target.checked);
				}}
			/>
		</label>
	</div>
	<div class="w-full mt-2">
		<div class="flex flex-col flex-wrap justify-between gap-x-2">
			<b>Time (seconds)</b>
			<label class="label cursor-pointer space-x-4">
				<span class="w-14 text-center">{pumpSettings.cum_time}</span>
				<input type="range" min="0" max="300" 
					bind:value={pumpSettings.cum_time} 
					class="range"
					on:change={(e) => {
						selectedPreset = '';
						updateSetting('cum_time', Number(e.target.value));
					}}
				/>
			</label>
			<b>Size</b>
			<label class="label cursor-pointer space-x-4">
				<span class="w-14 text-center">{cumSizeValue}</span>
				<input type="range" 
					min="1" 
					max="500" 
					step="1"
					bind:value={cumSizeValue} 
					class="range"
					on:change={(e) => {
						selectedPreset = '';
						updateSetting('cum_size', Number(e.target.value) * DIVISOR);
					}}
				/>
			</label>
			<b>Force</b>
			<label class="label cursor-pointer space-x-4">
				<span class="w-14 text-center">{cumAccelValue}</span>
				<input type="range" 
					min="1" 
					max="500" 
					step="1"
					bind:value={cumAccelValue} 
					class="range"
					on:change={(e) => {
						selectedPreset = '';
						updateSetting('cum_accel', Number(e.target.value) * DIVISOR);
					}}
				/>
			</label>
		</div>

		<hr class="my-4 border-gray-600" />

		<div class="flex flex-row flex-wrap justify-between gap-x-2 mt-2">
			<label class="label cursor-pointer">
				<b class="mr-4">Continuous</b>
				<input
					type="checkbox"
					class="toggle toggle-primary"
					bind:checked={pumpSettings.continuous}
					on:change={(e) => {
						selectedPreset = '';
						updateSetting('continuous', e.target.checked);
					}}
				/>
			</label>

			<div class="flex-grow" />
			<button 
				class="btn inline-flex items-center w-48 
					{pumpState.ejecting ? 'hover:bg-red-700 bg-red-800' : 'hover:bg-emerald-600 bg-emerald-700'
				}				"
				on:click={toggleEject}
			>
				{#if pumpState.ejecting}
					<!-- loading icon -->
					<Propeller class="animate-spin mr-2 h-5 w-5" />
					<span>Stop Ejecting</span>
				{:else}
					<!-- Icon and text when pumpState.ejecting is false -->
					<IconDropletFilled class="mr-2 h-5 w-5" />
					<span>Start Ejecting</span>
				{/if}
			</button>
		</div>
	</div>
</SettingsCard>
