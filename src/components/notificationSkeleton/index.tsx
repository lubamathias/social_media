import { Skeleton } from "../ui/skeleton";
import { ScrollArea } from "../ui/scroll-area";
import { Card, CardHeader, CardContent, CardTitle } from "../ui/card";


export function NotificationSkeleton(){
    const skeletonArray = Array.from({length: 5}, (_,i) => (i));

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>
                            Notificações
                        </CardTitle>
                        <Skeleton className="h-4 w-20"/>
                    </div>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[calc(100vh-12rem)]">
                        {skeletonArray.map((index) => (
                            <div key={index} className="flex items-start gap-4 p-4 ">
                                <Skeleton className="h-10 w-10 rounded-full"/>
                                <div className="flex-1 space-y-2 ">
                                    <Skeleton className="h-4 w-4"/>
                                    <Skeleton className="h-4 w-20"/>
                                </div>
                                <div className="pl-6 space-y-2">
                                    <Skeleton className="h-20 w-full"/>
                                    <Skeleton className="h-4 w-20"/>
                                </div>
                            </div>
                        ))}
                    </ScrollArea>
                </CardContent>
            </Card>

        </div>
    )
}