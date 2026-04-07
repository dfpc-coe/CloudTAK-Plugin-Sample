import type { App } from 'vue';
import { h } from 'vue';
import type { PluginAPI, PluginInstance } from '@tak-ps/cloudtak';
import { TablerDropdown } from '@tak-ps/vue-tabler';
import MenuTemplate from './lib/MenuTemplate.vue';
import SampleContainer from './lib/SampleContainer.vue';
import IconSampleUrl from './lib/Sample.svg';

const IconSample = {
    render: () => h('img', {
        src: IconSampleUrl,
        width: 32,
        height: 32
    })
};

const SAMPLE_ROUTE_NAME = 'home-menu-plugin-sample';
const SAMPLE_MENU_KEY = 'sample';
const SAMPLE_BOTTOM_BAR_KEY = 'sample-bottom-bar';
const SampleBottomBar = {
    render: () => h(TablerDropdown, {
        width: 240,
        position: 'top'
    }, {
        default: () => h('div', {
            class: 'd-flex align-items-center justify-content-center px-2 cursor-pointer cloudtak-hover',
            title: 'Sample Plugin Message'
        }, [
            h('img', {
                src: IconSampleUrl,
                width: 40,
                height: 40,
                style: 'filter: brightness(0) invert(1); opacity: 0.95;'
            })
        ]),
        dropdown: () => h('li', {
            class: 'dropdown-item-text px-3 py-2'
        }, [
            h('div', { class: 'fw-bold text-white' }, 'Sample Plugin'),
            h('div', { class: 'text-white-50 small' }, 'Hello from the sample bottom bar dropdown.')
        ])
    })
};

export default class Test {
    api: PluginAPI;

    constructor(api: PluginAPI) {
        this.api = api;
    }

    static async install(
        app: App,
        api: PluginAPI
    ): Promise<PluginInstance> {
        return new Test(api);
    }

    async enable(): Promise<void> {
        this.api.routes.add({
            path: 'plugin-sample',
            name: SAMPLE_ROUTE_NAME,
            component: {
                render: () => h(MenuTemplate, { name: 'Sample', backType: 'close' }, {
                    default: () => h(SampleContainer, { api: this.api })
                })
            }
        }, 'home-menu');

        this.api.menu.add({
            key: SAMPLE_MENU_KEY,
            label: 'Sample',
            route: SAMPLE_ROUTE_NAME,
            tooltip: 'Sample',
            description: 'Sensor Dashboard',
            icon: IconSample
        });

        this.api.bottomBar.add({
            key: SAMPLE_BOTTOM_BAR_KEY,
            component: SampleBottomBar
        });
    }

    async disable(): Promise<void> {
        this.api.bottomBar.remove(SAMPLE_BOTTOM_BAR_KEY);
        this.api.menu.remove(SAMPLE_MENU_KEY);
        this.api.router.removeRoute(SAMPLE_ROUTE_NAME);
    }
}
