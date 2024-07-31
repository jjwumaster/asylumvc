'use client';

import { useState, useEffect, useCallback } from 'react';
import { User, MediaObject } from '@prisma/client';
import { useRouter, useParams } from 'next/navigation';
import MediaGrid from '../../components/MediaGrid';

type BehaviorType = 'read' | 'look' | 'listen';
type SizeType = 's' | 'm' | 'l';

type MediaObjectWithUser = MediaObject & { user: User };

export default function DynamicPage() {
    const router = useRouter();
    const params = useParams();
    const [users, setUsers] = useState<User[]>([]);
    const [allMediaObjects, setAllMediaObjects] = useState<MediaObjectWithUser[]>([]);
    const [filteredMediaObjects, setFilteredMediaObjects] = useState<MediaObjectWithUser[]>([]);
    const [selectedUser, setSelectedUser] = useState<string | null>(null);
    const [selectedBehavior, setSelectedBehavior] = useState<BehaviorType | null>(null);
    const [selectedSize, setSelectedSize] = useState<SizeType | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
        fetchAllMediaObjects();
    }, []);

    useEffect(() => {
        const slug = params.slug as string[] | undefined;
        if (slug) {
            if (slug.length === 1) {
                if (['read', 'look', 'listen'].includes(slug[0])) {
                    setSelectedBehavior(slug[0] as BehaviorType);
                } else {
                    setSelectedUser(slug[0]);
                }
            } else if (slug.length === 2) {
                if (['read', 'look', 'listen'].includes(slug[0])) {
                    setSelectedBehavior(slug[0] as BehaviorType);
                    setSelectedSize(slug[1] as SizeType);
                } else {
                    setSelectedUser(slug[0]);
                    setSelectedBehavior(slug[1] as BehaviorType);
                }
            } else if (slug.length === 3) {
                setSelectedUser(slug[0]);
                setSelectedBehavior(slug[1] as BehaviorType);
                setSelectedSize(slug[2] as SizeType);
            }
        }
    }, [params]);

    const fetchUsers = async () => {
        const response = await fetch('/api/users');
        const data = await response.json();
        setUsers(data);
    };

    const fetchAllMediaObjects = async () => {
        setIsLoading(true);
        const response = await fetch('/api/media');
        const data: MediaObjectWithUser[] = await response.json();
        setAllMediaObjects(data);
        setIsLoading(false);
    };

    const filterMediaObjects = useCallback(() => {
        let filtered = allMediaObjects;

        if (selectedUser) {
            filtered = filtered.filter(obj => obj.user.name === selectedUser);
        }

        if (selectedBehavior) {
            const behaviorTypes = {
                read: ['Book', 'Post', 'Quote', 'Tweet'],
                look: ['Art', 'Film', 'Tiktok', 'Youtube'],
                listen: ['Music', 'Podcast']
            };
            filtered = filtered.filter(obj => behaviorTypes[selectedBehavior].includes(obj.type));
        }

        if (selectedSize) {
            filtered = filtered.filter(obj => obj.size === selectedSize);
        }

        setFilteredMediaObjects(filtered);
    }, [allMediaObjects, selectedUser, selectedBehavior, selectedSize]);

    useEffect(() => {
        filterMediaObjects();
    }, [filterMediaObjects]);

    const handleUserSelect = (username: string) => {
        updateURL(username === selectedUser ? null : username, selectedBehavior, selectedSize);
    };

    const handleBehaviorSelect = (behavior: BehaviorType) => {
        updateURL(selectedUser, behavior === selectedBehavior ? null : behavior, selectedSize);
    };

    const handleSizeSelect = (size: SizeType) => {
        updateURL(selectedUser, selectedBehavior, size === selectedSize ? null : size);
    };

    const updateURL = (user: string | null, behavior: BehaviorType | null, size: SizeType | null) => {
        let url = '/';
        if (user) url += `${user}/`;
        if (behavior) url += `${behavior}/`;
        if (size) url += `${size}`;
        router.push(url, { scroll: false });
    };

    const behaviorTypes: BehaviorType[] = ['read', 'look', 'listen'];
    const sizeTypes: SizeType[] = ['s', 'm', 'l'];

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8">AsylumVC Media Library</h1>

            <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Filters</h2>

                <div className="mb-4">
                    <h3 className="text-xl font-semibold mb-2">Users</h3>
                    <div className="flex flex-wrap gap-2">
                        {users.map(user => (
                            <button
                                key={user.id}
                                onClick={() => handleUserSelect(user.name)}
                                className={`px-4 py-2 rounded ${selectedUser === user.name ? 'bg-purple-500 text-white' : 'bg-gray-200'}`}
                            >
                                {user.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mb-4">
                    <h3 className="text-xl font-semibold mb-2">Behaviors</h3>
                    <div className="flex flex-wrap gap-2">
                        {behaviorTypes.map(behavior => (
                            <button
                                key={behavior}
                                onClick={() => handleBehaviorSelect(behavior)}
                                className={`px-4 py-2 rounded ${selectedBehavior === behavior ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                            >
                                {behavior.charAt(0).toUpperCase() + behavior.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mb-4">
                    <h3 className="text-xl font-semibold mb-2">Sizes</h3>
                    <div className="flex flex-wrap gap-2">
                        {sizeTypes.map(size => (
                            <button
                                key={size}
                                onClick={() => handleSizeSelect(size)}
                                className={`px-4 py-2 rounded ${selectedSize === size ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                            >
                                {size === 's' ? 'Small' : size === 'm' ? 'Medium' : 'Large'}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="text-center">Loading...</div>
            ) : (
                <MediaGrid mediaObjects={filteredMediaObjects} />
            )}
        </div>
    );
}