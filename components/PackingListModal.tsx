import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useState, useEffect } from 'react';
import { colors } from './colors';
import { X, Plus, Trash2 } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';

interface PackingItem {
  id: string;
  text: string;
  checked: boolean;
}

interface PackingListModalProps {
  visible: boolean;
  tripId: string;
  tripTitle: string;
  userId: string;
  onClose: () => void;
}

const DEFAULT_ITEMS = [
  'Passport / ID',
  'Phone charger',
  'Medications',
  'Toiletries',
  'Comfortable shoes',
  'Weather-appropriate clothing',
  'Sunglasses',
  'Reusable water bottle',
  'Travel adapter',
  'Cash / Credit cards',
  'Travel insurance documents',
  'Emergency contacts list',
];

export default function PackingListModal({ visible, tripId, tripTitle, userId, onClose }: PackingListModalProps) {
  const [items, setItems] = useState<PackingItem[]>([]);
  const [newItemText, setNewItemText] = useState('');
  const [loading, setLoading] = useState(false);
  const [packingListId, setPackingListId] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      loadPackingList();
    }
  }, [visible, tripId]);

  const loadPackingList = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('packing_lists')
        .select('*')
        .eq('trip_id', tripId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setPackingListId(data.id);
        setItems(data.items || []);
      } else {
        const defaultItems: PackingItem[] = DEFAULT_ITEMS.map((text, index) => ({
          id: `default-${index}`,
          text,
          checked: false,
        }));
        setItems(defaultItems);
      }
    } catch (error) {
      console.error('Error loading packing list:', error);
    } finally {
      setLoading(false);
    }
  };

  const savePackingList = async (updatedItems: PackingItem[]) => {
    try {
      if (packingListId) {
        await supabase
          .from('packing_lists')
          .update({
            items: updatedItems,
            updated_at: new Date().toISOString(),
          })
          .eq('id', packingListId);
      } else {
        const { data, error } = await supabase
          .from('packing_lists')
          .insert({
            trip_id: tripId,
            user_id: userId,
            items: updatedItems,
          })
          .select()
          .single();

        if (error) throw error;
        setPackingListId(data.id);
      }
    } catch (error) {
      console.error('Error saving packing list:', error);
    }
  };

  const toggleItem = (id: string) => {
    const updatedItems = items.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setItems(updatedItems);
    savePackingList(updatedItems);
  };

  const addItem = () => {
    if (newItemText.trim()) {
      const newItem: PackingItem = {
        id: `custom-${Date.now()}`,
        text: newItemText.trim(),
        checked: false,
      };
      const updatedItems = [...items, newItem];
      setItems(updatedItems);
      setNewItemText('');
      savePackingList(updatedItems);
    }
  };

  const removeItem = (id: string) => {
    const updatedItems = items.filter(item => item.id !== id);
    setItems(updatedItems);
    savePackingList(updatedItems);
  };

  const deleteList = async () => {
    try {
      if (packingListId) {
        await supabase
          .from('packing_lists')
          .delete()
          .eq('id', packingListId);
      }
      onClose();
    } catch (error) {
      console.error('Error deleting packing list:', error);
    }
  };

  const packedCount = items.filter(item => item.checked).length;
  const totalCount = items.length;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.title}>Packing List</Text>
              <Text style={styles.subtitle}>{tripTitle}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={28} color={colors.text} />
            </TouchableOpacity>
          </View>
          <Text style={styles.progress}>
            {packedCount} of {totalCount} packed
          </Text>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.content}
        >
          <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
            {items.map(item => (
              <View key={item.id} style={styles.itemRow}>
                <TouchableOpacity
                  style={styles.checkbox}
                  onPress={() => toggleItem(item.id)}
                >
                  <View style={[styles.checkboxInner, item.checked && styles.checkboxChecked]}>
                    {item.checked && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                </TouchableOpacity>
                <Text style={[styles.itemText, item.checked && styles.itemTextChecked]}>
                  {item.text}
                </Text>
                <TouchableOpacity
                  onPress={() => removeItem(item.id)}
                  style={styles.deleteButton}
                >
                  <X size={18} color={colors.error} />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          <View style={styles.addSection}>
            <TextInput
              style={styles.input}
              value={newItemText}
              onChangeText={setNewItemText}
              placeholder="Add custom item..."
              placeholderTextColor={colors.textLight}
              onSubmitEditing={addItem}
              returnKeyType="done"
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={addItem}
              disabled={!newItemText.trim()}
            >
              <Plus size={20} color={colors.white} />
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.deleteListButton}
              onPress={deleteList}
            >
              <Trash2 size={18} color={colors.white} />
              <Text style={styles.deleteListText}>Delete List</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.doneButton}
              onPress={onClose}
            >
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surfaceLight,
  },
  header: {
    backgroundColor: colors.white,
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textLight,
  },
  closeButton: {
    padding: 4,
  },
  progress: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.accent,
  },
  content: {
    flex: 1,
  },
  list: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 8,
    gap: 12,
  },
  checkbox: {
    padding: 4,
  },
  checkboxInner: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  checkmark: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  itemText: {
    flex: 1,
    fontSize: 15,
    color: colors.textDark,
  },
  itemTextChecked: {
    textDecorationLine: 'line-through',
    color: colors.textLight,
  },
  deleteButton: {
    padding: 4,
  },
  addSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  input: {
    flex: 1,
    backgroundColor: colors.surfaceLight,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.textDark,
  },
  addButton: {
    backgroundColor: colors.accent,
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
    backgroundColor: colors.white,
  },
  deleteListButton: {
    flex: 1,
    backgroundColor: colors.error,
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  deleteListText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '600',
  },
  doneButton: {
    flex: 1,
    backgroundColor: colors.accent,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
});
