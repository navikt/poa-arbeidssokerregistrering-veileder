import { useConfig } from '../contexts/config-context';

import { Config } from '../model/config';

function DemoLabel() {
    const { enableMock } = useConfig() as Config;
    const brukerMock = enableMock === 'enabled';

    if (!brukerMock) return null;

    return (
        <div className="top-0 left-0 -mb-4 h-16 w-32">
            <div className="text-red-600 text-4xl">DEMO</div>
        </div>
    );
}

export default DemoLabel;
