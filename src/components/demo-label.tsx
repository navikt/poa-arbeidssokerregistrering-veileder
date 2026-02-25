function DemoLabel() {
    const enableMock = process.env.NEXT_PUBLIC_ENABLE_MOCK === 'enabled';

    if (!enableMock) return null;

    return (
        <div className="top-0 left-0 -mb-4 h-16 w-32">
            <div className="text-ax-danger-700 text-4xl">DEMO</div>
        </div>
    );
}

export default DemoLabel;
