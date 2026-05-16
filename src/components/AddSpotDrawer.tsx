import { Drawer } from "vaul";

interface AddSpotDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    location: [number, number] | null;
}

export function AddSpotDrawer({ open, onOpenChange, location }: AddSpotDrawerProps) {

    // Form state can be added here

    return (
        <Drawer.Root open={open} onOpenChange={onOpenChange}>
            <Drawer.Portal>
                <Drawer.Overlay className="fixed inset-0 bg-black/40" />
                <Drawer.Content className="bg-card flex flex-col rounded-t-[10px] h-[85vh] mt-24 fixed bottom-0 left-0 right-0 z-50 outline-none border-t border-border">
                    <div className="p-4 bg-background rounded-t-[10px] flex-1 overflow-y-auto">
                        <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted mb-6" />

                        <div className="max-w-md mx-auto">
                            <Drawer.Title className="text-xl font-bold mb-4">Add New Spot</Drawer.Title>
                            {!location ? (
                                <p className="text-muted-foreground">Please click on the map to set the location.</p>
                            ) : (
                                <div>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Location: {location[1].toFixed(4)}, {location[0].toFixed(4)}
                                    </p>
                                    {/* Form Fields will go here */}
                                    <button className="w-full bg-primary text-primary-foreground p-3 rounded-lg font-bold">
                                        Save Spot
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    );
}
