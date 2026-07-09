import { useState } from 'react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Badge } from './ui/badge';
import { motion } from 'motion/react';
import {
  Phone,
  Mail,
  MessageSquare,
  FileText,
  Zap,
  Calendar,
  Clock,
  Send,
  CheckCircle,
} from 'lucide-react';
import { toast } from 'sonner';

interface CommunicationLoggerProps {
  entityName: string;
  entityType: string;
  onAskMarbim?: (prompt: string) => void;
}

type LogType = 'phone' | 'email' | 'whatsapp' | 'note' | 'marbim' | null;

interface LogFormData {
  type: LogType;
  subject?: string;
  duration?: string;
  outcome?: string;
  sentiment?: string;
  content: string;
  followUpDate?: string;
  tags?: string[];
}

export function CommunicationLogger({ entityName, entityType, onAskMarbim }: CommunicationLoggerProps) {
  const [activeDialog, setActiveDialog] = useState<LogType>(null);
  const [formData, setFormData] = useState<LogFormData>({
    type: null,
    content: '',
  });

  const handleOpenDialog = (type: LogType) => {
    setActiveDialog(type);
    setFormData({ type, content: '' });
  };

  const handleCloseDialog = () => {
    setActiveDialog(null);
    setFormData({ type: null, content: '' });
  };

  const handleSubmit = () => {
    // In a real app, this would save to a database
    const logTypeLabel = activeDialog?.toUpperCase();
    toast.success(`${logTypeLabel} log added successfully`, {
      description: `Communication logged for ${entityName}`,
    });
    handleCloseDialog();
  };

  const handleMarbimAction = () => {
    if (onAskMarbim) {
      onAskMarbim(`Create a communication log summary for ${entityName} (${entityType})`);
    }
    handleCloseDialog();
  };

  const logButtons = [
    {
      type: 'phone' as LogType,
      icon: Phone,
      label: 'Phone Call',
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'hover:shadow-blue-500/50',
    },
    {
      type: 'email' as LogType,
      icon: Mail,
      label: 'Email',
      color: 'from-purple-500 to-purple-600',
      hoverColor: 'hover:shadow-purple-500/50',
    },
    {
      type: 'whatsapp' as LogType,
      icon: MessageSquare,
      label: 'WhatsApp',
      color: 'from-green-500 to-green-600',
      hoverColor: 'hover:shadow-green-500/50',
    },
    {
      type: 'note' as LogType,
      icon: FileText,
      label: 'Note',
      color: 'from-orange-500 to-orange-600',
      hoverColor: 'hover:shadow-orange-500/50',
    },
    {
      type: 'marbim' as LogType,
      icon: Zap,
      label: 'Marbim AI',
      color: 'from-[#EAB308] to-[#F59E0B]',
      hoverColor: 'hover:shadow-[#EAB308]/50',
    },
  ];

  return (
    <>
      {/* Communication Log Buttons */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-xs uppercase tracking-wider text-[#6F83A7]/80 mr-1">Communication</span>
        <div className="h-4 w-px bg-white/10" />
        {logButtons.map((btn) => {
          const Icon = btn.icon;
          const colorMap = {
            'phone': { text: 'text-blue-400', border: 'border-blue-500/30', bg: 'bg-blue-500/10', glow: 'hover:shadow-blue-500/20' },
            'email': { text: 'text-purple-400', border: 'border-purple-500/30', bg: 'bg-purple-500/10', glow: 'hover:shadow-purple-500/20' },
            'whatsapp': { text: 'text-green-400', border: 'border-green-500/30', bg: 'bg-green-500/10', glow: 'hover:shadow-green-500/20' },
            'note': { text: 'text-orange-400', border: 'border-orange-500/30', bg: 'bg-orange-500/10', glow: 'hover:shadow-orange-500/20' },
            'marbim': { text: 'text-[#EAB308]', border: 'border-[#EAB308]/30', bg: 'bg-[#EAB308]/10', glow: 'hover:shadow-[#EAB308]/30' },
          };
          const colors = colorMap[btn.type as keyof typeof colorMap];
          
          return (
            <motion.button
              key={btn.type}
              onClick={() => handleOpenDialog(btn.type)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className={`
                group relative px-3 py-2 rounded-lg
                ${colors.bg} ${colors.border} border
                backdrop-blur-sm transition-all duration-200
                hover:bg-white/5 ${colors.glow} hover:shadow-lg
                flex items-center gap-2
              `}
            >
              {/* Icon with gradient background */}
              <div className={`
                w-7 h-7 rounded-md ${colors.bg} border ${colors.border}
                flex items-center justify-center
                transition-transform duration-200 group-hover:scale-110
              `}>
                <Icon className={`w-3.5 h-3.5 ${colors.text}`} />
              </div>
              
              {/* Label */}
              <span className={`
                text-xs ${colors.text} transition-colors duration-200
                group-hover:text-white
              `}>
                {btn.label}
              </span>

              {/* Subtle glow effect on hover */}
              <div className={`
                absolute inset-0 rounded-lg ${colors.bg} opacity-0 
                group-hover:opacity-100 transition-opacity duration-200 -z-10 blur-sm
              `} />
            </motion.button>
          );
        })}
      </div>

      {/* Phone Call Dialog */}
      <Dialog open={activeDialog === 'phone'} onOpenChange={(open) => !open && handleCloseDialog()}>
        <DialogContent className="bg-gradient-to-br from-[#0D1117] via-[#151B28] to-[#0D1117] border-white/10 text-white max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl text-white">Log Phone Call</DialogTitle>
                <DialogDescription className="text-[#6F83A7]">
                  Record details of your phone conversation
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Entity Info Badge */}
            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
              <div className="text-sm text-[#6F83A7] mb-1">Contact</div>
              <div className="text-white">{entityName}</div>
              <Badge className="mt-2 bg-[#57ACAF]/20 text-[#57ACAF] border-[#57ACAF]/30">
                {entityType}
              </Badge>
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <Label htmlFor="phone-subject" className="text-white">Subject</Label>
              <Input
                id="phone-subject"
                placeholder="e.g., Product inquiry discussion"
                className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]"
                value={formData.subject || ''}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              />
            </div>

            {/* Duration & Outcome */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone-duration" className="text-white">Duration</Label>
                <Input
                  id="phone-duration"
                  placeholder="e.g., 15 mins"
                  className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]"
                  value={formData.duration || ''}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone-outcome" className="text-white">Outcome</Label>
                <Select
                  value={formData.outcome || ''}
                  onValueChange={(value) => setFormData({ ...formData, outcome: value })}
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]">
                    <SelectValue placeholder="Select outcome" className="text-white" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0D1117] border-white/10 text-white">
                    <SelectItem value="successful" className="text-white hover:bg-white/10 focus:bg-white/10 focus:text-white">Successful</SelectItem>
                    <SelectItem value="no-answer" className="text-white hover:bg-white/10 focus:bg-white/10 focus:text-white">No Answer</SelectItem>
                    <SelectItem value="voicemail" className="text-white hover:bg-white/10 focus:bg-white/10 focus:text-white">Voicemail</SelectItem>
                    <SelectItem value="follow-up" className="text-white hover:bg-white/10 focus:bg-white/10 focus:text-white">Need Follow-up</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="phone-notes" className="text-white">Call Notes</Label>
              <Textarea
                id="phone-notes"
                placeholder="Enter detailed notes from the conversation..."
                className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7] min-h-[100px]"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              />
            </div>

            {/* Sentiment */}
            <div className="space-y-2">
              <Label className="text-white">Conversation Tone</Label>
              <div className="flex gap-2">
                {['Positive', 'Neutral', 'Negative'].map((sentiment) => (
                  <Button
                    key={sentiment}
                    size="sm"
                    variant="outline"
                    onClick={() => setFormData({ ...formData, sentiment })}
                    className={`
                      ${formData.sentiment === sentiment
                        ? 'bg-[#EAB308]/20 border-[#EAB308] text-[#EAB308]'
                        : 'bg-white/5 border-white/10 text-[#6F83A7] hover:text-white'
                      }
                    `}
                  >
                    {sentiment}
                  </Button>
                ))}
              </div>
            </div>

            {/* Follow-up Date */}
            <div className="space-y-2">
              <Label htmlFor="phone-followup" className="text-white">Follow-up Date</Label>
              <Input
                id="phone-followup"
                type="date"
                className="bg-white/5 border-white/10 text-white"
                value={formData.followUpDate || ''}
                onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="ghost"
              onClick={handleCloseDialog}
              className="text-[#6F83A7] hover:text-white hover:bg-white/5"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/30"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Save Call Log
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Email Dialog */}
      <Dialog open={activeDialog === 'email'} onOpenChange={(open) => !open && handleCloseDialog()}>
        <DialogContent className="bg-gradient-to-br from-[#0D1117] via-[#151B28] to-[#0D1117] border-white/10 text-white max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl text-white">Log Email</DialogTitle>
                <DialogDescription className="text-[#6F83A7]">
                  Record email communication details
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
              <div className="text-sm text-[#6F83A7] mb-1">Recipient</div>
              <div className="text-white">{entityName}</div>
              <Badge className="mt-2 bg-[#57ACAF]/20 text-[#57ACAF] border-[#57ACAF]/30">
                {entityType}
              </Badge>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email-subject" className="text-white">Email Subject</Label>
              <Input
                id="email-subject"
                placeholder="e.g., Product catalog and pricing"
                className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]"
                value={formData.subject || ''}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email-type" className="text-white">Email Type</Label>
              <Select
                value={formData.outcome || ''}
                onValueChange={(value) => setFormData({ ...formData, outcome: value })}
              >
                <SelectTrigger className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]">
                  <SelectValue placeholder="Select type" className="text-white" />
                </SelectTrigger>
                <SelectContent className="bg-[#0D1117] border-white/10 text-white">
                  <SelectItem value="sent" className="text-white hover:bg-white/10 focus:bg-white/10 focus:text-white">Sent</SelectItem>
                  <SelectItem value="received" className="text-white hover:bg-white/10 focus:bg-white/10 focus:text-white">Received</SelectItem>
                  <SelectItem value="draft" className="text-white hover:bg-white/10 focus:bg-white/10 focus:text-white">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email-content" className="text-white">Email Summary</Label>
              <Textarea
                id="email-content"
                placeholder="Enter email summary or key points..."
                className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7] min-h-[120px]"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white">Response Required?</Label>
              <div className="flex gap-2">
                {['Yes', 'No'].map((option) => (
                  <Button
                    key={option}
                    size="sm"
                    variant="outline"
                    onClick={() => setFormData({ ...formData, sentiment: option })}
                    className={`
                      ${formData.sentiment === option
                        ? 'bg-[#EAB308]/20 border-[#EAB308] text-[#EAB308]'
                        : 'bg-white/5 border-white/10 text-[#6F83A7] hover:text-white'
                      }
                    `}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="ghost"
              onClick={handleCloseDialog}
              className="text-[#6F83A7] hover:text-white hover:bg-white/5"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg shadow-purple-500/30"
            >
              <Send className="w-4 h-4 mr-2" />
              Save Email Log
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* WhatsApp Dialog */}
      <Dialog open={activeDialog === 'whatsapp'} onOpenChange={(open) => !open && handleCloseDialog()}>
        <DialogContent className="bg-gradient-to-br from-[#0D1117] via-[#151B28] to-[#0D1117] border-white/10 text-white max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/30">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl text-white">Log WhatsApp Message</DialogTitle>
                <DialogDescription className="text-[#6F83A7]">
                  Record WhatsApp conversation details
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
              <div className="text-sm text-[#6F83A7] mb-1">Contact</div>
              <div className="text-white">{entityName}</div>
              <Badge className="mt-2 bg-[#57ACAF]/20 text-[#57ACAF] border-[#57ACAF]/30">
                {entityType}
              </Badge>
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp-type" className="text-white">Message Type</Label>
              <Select
                value={formData.outcome || ''}
                onValueChange={(value) => setFormData({ ...formData, outcome: value })}
              >
                <SelectTrigger className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]">
                  <SelectValue placeholder="Select type" className="text-white" />
                </SelectTrigger>
                <SelectContent className="bg-[#0D1117] border-white/10 text-white">
                  <SelectItem value="text" className="text-white hover:bg-white/10 focus:bg-white/10 focus:text-white">Text Message</SelectItem>
                  <SelectItem value="voice" className="text-white hover:bg-white/10 focus:bg-white/10 focus:text-white">Voice Note</SelectItem>
                  <SelectItem value="image" className="text-white hover:bg-white/10 focus:bg-white/10 focus:text-white">Image/Document</SelectItem>
                  <SelectItem value="video" className="text-white hover:bg-white/10 focus:bg-white/10 focus:text-white">Video Call</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp-content" className="text-white">Message Summary</Label>
              <Textarea
                id="whatsapp-content"
                placeholder="Enter conversation summary..."
                className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7] min-h-[120px]"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white">Conversation Status</Label>
              <div className="flex gap-2">
                {['Ongoing', 'Resolved', 'Pending'].map((status) => (
                  <Button
                    key={status}
                    size="sm"
                    variant="outline"
                    onClick={() => setFormData({ ...formData, sentiment: status })}
                    className={`
                      ${formData.sentiment === status
                        ? 'bg-[#EAB308]/20 border-[#EAB308] text-[#EAB308]'
                        : 'bg-white/5 border-white/10 text-[#6F83A7] hover:text-white'
                      }
                    `}
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="ghost"
              onClick={handleCloseDialog}
              className="text-[#6F83A7] hover:text-white hover:bg-white/5"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg shadow-green-500/30"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Save WhatsApp Log
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Note Dialog */}
      <Dialog open={activeDialog === 'note'} onOpenChange={(open) => !open && handleCloseDialog()}>
        <DialogContent className="bg-gradient-to-br from-[#0D1117] via-[#151B28] to-[#0D1117] border-white/10 text-white max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/30">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl text-white">Add Note</DialogTitle>
                <DialogDescription className="text-[#6F83A7]">
                  Create a new note or observation
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
              <div className="text-sm text-[#6F83A7] mb-1">Related to</div>
              <div className="text-white">{entityName}</div>
              <Badge className="mt-2 bg-[#57ACAF]/20 text-[#57ACAF] border-[#57ACAF]/30">
                {entityType}
              </Badge>
            </div>

            <div className="space-y-2">
              <Label htmlFor="note-subject" className="text-white">Note Title</Label>
              <Input
                id="note-subject"
                placeholder="e.g., Meeting takeaways"
                className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]"
                value={formData.subject || ''}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="note-category" className="text-white">Category</Label>
              <Select
                value={formData.outcome || ''}
                onValueChange={(value) => setFormData({ ...formData, outcome: value })}
              >
                <SelectTrigger className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]">
                  <SelectValue placeholder="Select category" className="text-white" />
                </SelectTrigger>
                <SelectContent className="bg-[#0D1117] border-white/10 text-white">
                  <SelectItem value="general" className="text-white hover:bg-white/10 focus:bg-white/10 focus:text-white">General</SelectItem>
                  <SelectItem value="meeting" className="text-white hover:bg-white/10 focus:bg-white/10 focus:text-white">Meeting Notes</SelectItem>
                  <SelectItem value="idea" className="text-white hover:bg-white/10 focus:bg-white/10 focus:text-white">Idea/Suggestion</SelectItem>
                  <SelectItem value="concern" className="text-white hover:bg-white/10 focus:bg-white/10 focus:text-white">Concern/Issue</SelectItem>
                  <SelectItem value="action" className="text-white hover:bg-white/10 focus:bg-white/10 focus:text-white">Action Item</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="note-content" className="text-white">Note Content</Label>
              <Textarea
                id="note-content"
                placeholder="Enter your note here..."
                className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7] min-h-[150px]"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white">Priority</Label>
              <div className="flex gap-2">
                {['High', 'Medium', 'Low'].map((priority) => (
                  <Button
                    key={priority}
                    size="sm"
                    variant="outline"
                    onClick={() => setFormData({ ...formData, sentiment: priority })}
                    className={`
                      ${formData.sentiment === priority
                        ? 'bg-[#EAB308]/20 border-[#EAB308] text-[#EAB308]'
                        : 'bg-white/5 border-white/10 text-[#6F83A7] hover:text-white'
                      }
                    `}
                  >
                    {priority}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="ghost"
              onClick={handleCloseDialog}
              className="text-[#6F83A7] hover:text-white hover:bg-white/5"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg shadow-orange-500/30"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Save Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Marbim AI Dialog */}
      <Dialog open={activeDialog === 'marbim'} onOpenChange={(open) => !open && handleCloseDialog()}>
        <DialogContent className="bg-gradient-to-br from-[#0D1117] via-[#151B28] to-[#0D1117] border-white/10 text-white max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#EAB308] to-[#F59E0B] flex items-center justify-center shadow-lg shadow-[#EAB308]/50">
                <Zap className="w-6 h-6 text-black" />
              </div>
              <div>
                <DialogTitle className="text-xl text-white">Marbim AI Log Assistant</DialogTitle>
                <DialogDescription className="text-[#6F83A7]">
                  Let AI help you create a communication log
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="p-4 rounded-lg bg-gradient-to-br from-[#EAB308]/10 to-[#57ACAF]/10 border border-[#EAB308]/30">
              <div className="flex items-start gap-3 mb-3">
                <Zap className="w-5 h-5 text-[#EAB308] mt-0.5" />
                <div>
                  <div className="text-sm text-white mb-1">AI-Powered Logging</div>
                  <div className="text-xs text-[#6F83A7]">
                    Marbim will help you create comprehensive communication logs with AI-generated insights and suggestions.
                  </div>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="text-sm text-[#6F83A7] mb-1">Entity</div>
                <div className="text-white">{entityName}</div>
                <Badge className="mt-2 bg-[#57ACAF]/20 text-[#57ACAF] border-[#57ACAF]/30">
                  {entityType}
                </Badge>
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-sm text-white mb-2">Quick Actions:</div>
              <Button
                onClick={() => {
                  if (onAskMarbim) {
                    onAskMarbim(`Create a comprehensive communication summary for ${entityName}`);
                  }
                  handleCloseDialog();
                }}
                className="w-full justify-start bg-white/5 hover:bg-white/10 text-white border border-white/10"
              >
                <Zap className="w-4 h-4 mr-2 text-[#EAB308]" />
                Generate Communication Summary
              </Button>
              <Button
                onClick={() => {
                  if (onAskMarbim) {
                    onAskMarbim(`Suggest follow-up actions for ${entityName} based on recent interactions`);
                  }
                  handleCloseDialog();
                }}
                className="w-full justify-start bg-white/5 hover:bg-white/10 text-white border border-white/10"
              >
                <Zap className="w-4 h-4 mr-2 text-[#EAB308]" />
                Suggest Follow-up Actions
              </Button>
              <Button
                onClick={() => {
                  if (onAskMarbim) {
                    onAskMarbim(`Analyze communication patterns and sentiment for ${entityName}`);
                  }
                  handleCloseDialog();
                }}
                className="w-full justify-start bg-white/5 hover:bg-white/10 text-white border border-white/10"
              >
                <Zap className="w-4 h-4 mr-2 text-[#EAB308]" />
                Analyze Communication Patterns
              </Button>
              <Button
                onClick={() => {
                  if (onAskMarbim) {
                    onAskMarbim(`Draft a personalized email template for ${entityName}`);
                  }
                  handleCloseDialog();
                }}
                className="w-full justify-start bg-white/5 hover:bg-white/10 text-white border border-white/10"
              >
                <Zap className="w-4 h-4 mr-2 text-[#EAB308]" />
                Draft Email Template
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="ghost"
              onClick={handleCloseDialog}
              className="text-[#6F83A7] hover:text-white hover:bg-white/5"
            >
              Close
            </Button>
            <Button
              onClick={handleMarbimAction}
              className="bg-gradient-to-r from-[#EAB308] to-[#F59E0B] hover:from-[#F59E0B] hover:to-[#EAB308] text-black shadow-lg shadow-[#EAB308]/50"
            >
              <Zap className="w-4 h-4 mr-2" />
              Open Marbim Assistant
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
