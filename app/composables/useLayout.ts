export const useLayout = () => {
    const isSidebarCollapsed = useState<boolean>('isSidebarCollapsed', () => false);

    const toggleSidebar = () => {
        isSidebarCollapsed.value = !isSidebarCollapsed.value;
    };

    return {
        isSidebarCollapsed,
        toggleSidebar
    };
};
