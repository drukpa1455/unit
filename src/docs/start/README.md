# Getting Started

Following is a list of useful features that can help you with graph manipulation.

## Search

To start Search you can either focus on the Search Input or press key <kbd>;</kbd> (semicolon).

You can filter the list by typing on the input box.

To add the selected unit either press on the green unit, or the selected search item, or press key <kbd>Enter</kbd>.

![](/public/gif/start/1.gif)

## Connect

To connect (also merge) two compatible pins, click on a pin, then click on a compatible target pin. The compatible pins will be highlighted in green.

![](/public/gif/start/17.gif)

## Create Data

To start editing a new empty datum, double click on the editor background, then start typing.

![](/public/gif/start/14.gif)

You can write any JSON compatible type, including arrays and objects.

![](/public/gif/start/15.gif)

Drag and Drop a datum to a compatible input pin to activate it.

![](/public/gif/start/30.gif)

## Add Mode

To enter Add Mode (also Green Mode) you can either click on the "plus sign" mode button or press key <kbd>S</kbd>.

In Add Mode, it is possible to copy a unit (or the currently Selected Subgraph).

A unit can be shallow clonned with a Green Drag and Drop:

![](/public/gif/start/9.gif)

![](/public/gif/start/18.gif)

Green Click on a unit will Copy To Clipboard. Then Green Double Click on the background will paste whatever is on the Clipboard.

![](/public/gif/start/11.gif)

## Info Mode

To enter Info Mode you can either click on the "lines" mode button or press key <kbd>Q</kbd>.

It will show you documentation about a unit, such as its type, pin types and description.

![](/public/gif/start/22.gif)

Info Click on an editable unit name to rename.

![](/public/gif/start/27.gif)

## Data Mode

To enter Data Mode (also Chartreuse/Yellow Mode) you can either click on the "triangle" mode button or press key <kbd>A</kbd>.

In Data Mode, double click on the background to add a random datum. If you click on an input, the system will attempt suggest a suitable compatible random datum.

![](/public/gif/start/23.gif)

Yellow Dragging a unit will create a deep copy of it, with the same current state.

![](/public/gif/start/24.gif)

## Remove Mode

To enter Remove Mode (Red Mode) you can either click on the "x" mode button or press key <kbd>D</kbd>.

Clicking on any node (unit, datum, etc.) will cut that node out, effectively deactivating, removing it from the graph, and adding to the Clipboard.

This also useful as a quick manual way of deleting data iteratively.

![](/public/gif/start/5.gif)

Many nodes can be removed with Multiselection.

## Change Mode

To enter Change Mode (Blue Mode) you can either click on the "z" mode button or press key <kbd>F</kbd>.

![](/public/gif/start/8.gif)

In Change Mode, clicking on an input or output will set it to constant or not.

![](/public/gif/start/25.gif)

## Graph or Tree Layout

To switch between Graph Layout or Tree Layout, click on the "circle or square" toggle close to the Search.

![](/public/gif/start/20.gif)

This view will show only the current components, which can composed and reordered into a parent-children tree structure, making it possible to build any type of visual layout.

![](/public/gif/start/21.gif)

## Fullwindow

To go Fullwindow you can press the "transcend" button, usually located at the top.

This will remove the editing GUI and show the final rendering of the graph. This is more interesting when there are components around, making up a website.

![](/public/gif/start/0.gif)

The components that will go fullwindow are dependent on the context. This enables many layout combinations out of shelf.

![](/public/gif/start/10.gif)

## Resize Component

A component can be resize when it is either selected or unlocked. To resize, pull from one of the components sides or edges.

![](/public/gif/start/19.gif)

## Unlock | Lock Component

To unlock a component unit, Double Click on it.

![](/public/gif/start/16.gif)

## Drawing

To start Drawing do a Click + Long Press (also known as Click and Hold).

Draw a line from center to the outside to create an output plug. Inversely, draw a line from the outside to the center to create an input plug.

![](/public/gif/start/31.gif)

Draw a circle to create an empty unit. Draw a rectangle to create an empty unit that is a component.

![](/public/gif/start/33.gif)

## Composition

To collapse a subgraph into a new unit, on Multiselect Mode, select a subgraph and do Long Press on the background.

![](/public/gif/start/34.gif)

Reversely, on Multiselect Mode, a selected graph can be exploded by a Long Press.

![](/public/gif/start/35.gif)

## Enter | Leave Graph

To enter a graph unit, Long Click on it. To leave, Long Click on the background.

![](/public/gif/start/26.gif)

You can edit a unit from inside.

![](/public/gif/start/32.gif)
