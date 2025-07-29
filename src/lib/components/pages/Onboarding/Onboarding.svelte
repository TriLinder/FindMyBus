<script>
    import { _ } from 'svelte-i18n';
    import confetti from 'canvas-confetti';
    import { finishedInteractionsStore, currentPageStore, settingsStore } from '../../../../stores';

    import { Block, BlockTitle, Button, List} from "konsta/svelte";
    
    import LanguageSetting from "../Settings/LanguageSetting.svelte";
    import StaticGtfsFeedSetting from "../Settings/StaticGtfsFeedSetting.svelte";
    import RealtimeGtfsFeedSetting from "../Settings/RealtimeGtfsFeedSetting.svelte";
    import RealtimeGtfsFeedUpdateIntervalSetting from '../Settings/RealtimeGtfsFeedUpdateIntervalSetting.svelte';

    let playingFinishAnimation = false;

    function launchConfettiAtRandomPoint() {
        confetti({
            disableForReducedMotion: true,
            particleCount: 1500,
            startVelocity: 30,
            gravity: 0.5,
            spread: 360,
            zIndex: 9999999, // confetti's always on top of course
            origin: {
                x: Math.random(),
                y: Math.random()
            }
        });
    }

    function finish() {
        // Remember the user has gone through this process (this weird way to modify the store is required,
        // as for some reason simply pushing to the store wasn't detected, and thus wasn't saved)
        const finishedInteractions = finishedInteractionsStore.get();
        if (!finishedInteractions.includes('onboarding')) {
            finishedInteractions.push('onboarding');
            finishedInteractionsStore.set(finishedInteractions);
        } else {
            console.warn("It seems like we've already gone through the onboarding process before");
        }

        // Finally, time to go to the main page
        $currentPageStore = 'main';
    }

    function startFinishSequence() {
        // Make sure the user doesn't interact with anything during this time
        playingFinishAnimation = true;

        // Launch confetti all over the screen
        setTimeout(launchConfettiAtRandomPoint, 100);
        setTimeout(launchConfettiAtRandomPoint, 500);
        setTimeout(launchConfettiAtRandomPoint, 1000)
        setTimeout(launchConfettiAtRandomPoint, 1500);

        // Just in case it gets really laggy, clear the confetti after a while
        setTimeout(function() {confetti.reset()}, 5000);

        // Now wait around, and actually finish the onboarding process.
        // Though if the user prefers reduced motion, we might as well skip this
        // (they won't see the confetti in the first place anyway, so why bother waiting)
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (!prefersReducedMotion) {
            setTimeout(finish, 2250);
        } else {
            finish();
        }
    }

    $: allowFinishButon = $settingsStore.staticGtfsUrl && $settingsStore.realtimeGtfsUrl && !playingFinishAnimation;
</script>

<style>
    .content {
        margin-top: 40px;
        margin-bottom: 40px;
    }

    h1 {
        color: black;
        text-align: center;
        font-size: 32px;
        font-weight: bold;
    }

    .no-interaction {
        pointer-events: none;
        user-select: none;
        nav-index: -1;
    }

    .horizontal-center {
        display: flex;
        width: 100%;
        justify-content: center;
    }

    .finishButtonContainer {
        width: 80vw;
    }
</style>

<div class="content" class:no-interaction={playingFinishAnimation}>
    <h1>{$_('onboarding.title')}</h1>

    <Block strong inset>
        {@html $_('onboarding.text')}
    </Block>

    <BlockTitle>{$_('onboarding.settings')}</BlockTitle>
    <List strong inset>
        <LanguageSetting/>
        <StaticGtfsFeedSetting/>
        <RealtimeGtfsFeedSetting/>
        <RealtimeGtfsFeedUpdateIntervalSetting/>
    </List>

    <div class="horizontal-center">
        <div class="finishButtonContainer">
            <Button onClick={startFinishSequence} disabled={!allowFinishButon}>{$_('onboarding.finishButton')}</Button>
        </div>
    </div>
</div>