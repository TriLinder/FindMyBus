<script lang="ts">
    import { _ } from "svelte-i18n";

    import { Navbar, Block, BlockTitle, List } from "konsta/svelte";

    import StaticGtfsFeedSetting from "./StaticGtfsFeedSetting.svelte";
</script>

<Navbar title={$_('settings.title')}/> 
<BlockTitle medium>{$_('settings.gtfsFeed')}</BlockTitle>
<Block strong>
    <List>
        <StaticGtfsFeedSetting/>
    </List>
</Block>