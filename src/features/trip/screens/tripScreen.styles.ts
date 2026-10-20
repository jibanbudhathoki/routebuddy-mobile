import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  content: {
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.lg,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  title: {
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: '700',
  },
  segmentControl: {
    borderColor: theme.colors.primary,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: theme.spacing.lg,
    overflow: 'hidden',
  },
  segment: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: theme.spacing.xs,
    justifyContent: 'center',
    minHeight: 42,
    paddingHorizontal: theme.spacing.xs,
  },
  activeSegment: {
    backgroundColor: theme.colors.primary,
  },
  segmentLabel: {
    color: theme.colors.text,
    fontSize: 12,
    fontWeight: '500',
  },
  activeSegmentLabel: {
    color: theme.colors.onPrimary,
  },
  assignedCountBadge: {
    alignItems: 'center',
    backgroundColor: theme.colors.primarySoft,
    borderRadius: theme.radius.sm,
    minWidth: 22,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 2,
  },
  assignedCountText: {
    color: theme.colors.text,
    fontSize: 10,
    fontWeight: '700',
  },
  activeAssignedCountBadge: {
    backgroundColor: theme.colors.onPrimary,
  },
  activeAssignedCountText: {
    color: theme.colors.primary,
  },
  sectionHeading: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  sectionTitleGroup: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  tripList: {
    gap: theme.spacing.sm,
  },
  emptyState: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    gap: theme.spacing.sm,
    padding: theme.spacing.lg,
  },
  emptyStateTitle: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  emptyStateText: {
    color: theme.colors.muted,
    fontSize: 12,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.sm,
    marginTop: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  retryButtonText: {
    color: theme.colors.onPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
}));
